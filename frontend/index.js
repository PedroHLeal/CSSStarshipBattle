import SomeJsPhysics from "./SomeJSPhysics/somephysicsjs/somejsphysics.js";
import { getDistance } from "./SomeJSPhysics/somephysicsjs/Utils/geometry.js";
import { initSockets, sendBulletPosition, sendShipPosition } from "./sockets.js";
import Bullet from "./bullet.js";

import Ship from "./ship.js";
import Ring from "./ring.js";
import Explosion from "./explosion.js";

let socket = null;

let field = null;
let physics = null;

let ring = new Ring();
let keysPressed = [];
let isHost = false;
let playerNumber = null;
const currentPlayers = [];
const camera = { x: 0, y: 0 };

const playerStartingPoints = {
  1: [-50, -50],
  2: [-50, 50],
  3: [-50, 50],
  4: [50, 50],
};

initSockets(
  (s) => {
    socket = s;
  },
  (type, message) => {
    switch (type) {
      case "setPlayer":
        isHost = true;
        playerNumber = message.playerNumber;
        isHost = playerNumber === 1;
        socket.send(JSON.stringify({ type: "addPlayer", playerNumber }));
        break;
      case "addPlayer":
        addPlayer(message.playerNumber);
        if (!physics.running) {
          physics.start(60);
        }
        break;
      case "shipposition":
        if (message.playerNumber !== playerNumber) {
          const ship = physics.getById(`ship${message.playerNumber}`);
          ship.setFromMessage(message);
        }
        break;
      case "bulletposition":
          if (!isHost) {
            const bullet = physics.getById(message.id);
            bullet.setFromMessage(message);
          }
          break;
      case "shoot":
        if (message.playerNumber !== playerNumber) {
          addBullet(message);
        }
        break;
    }
  },
  (err) => {
    console.log(err);
  }
);

function addPlayer(number) {
  for (let i = 1; i <= number; i++) {
    if (!currentPlayers.includes(i)) {
      const ship = new Ship(`ship${i}`, false);
      ship.posX = playerStartingPoints[number][0];
      ship.posY = playerStartingPoints[number][1];
      physics.add(ship);
      currentPlayers.push(i);
    }
  }
}

function addBullet(message) {
  const ship = physics.getById(`ship${message.playerNumber}`);
  const bullet = new Bullet(
    message.id,
    message.rotation,
    message.posX,
    message.posY,
    ship
  );
  physics.add(bullet);
}

field = document.getElementById("field");
physics = new SomeJsPhysics("field");

ring = new Ring();
physics.add(ring);
keysPressed = [];

const toggleStop = () => {
  if (physics.running) {
    physics.stop();
    field.style.backgroundColor = "#333";
  } else {
    physics.start(60);
    field.style.backgroundColor = "#000";
  }
};

const onCollision = (element, collider) => {
  if (
    element.type === "ship" &&
    collider.parent !== element &&
    collider.type === "bullet"
  ) {
    element.takeDamage([0, 0]);
    let explosion = new Explosion(`${collider.id}-explosion`, collider.posX, collider.posY);
    physics.add(explosion);
    collider.shouldDestroy = true;
  }
};

const handleCollisions = (element) => {
  if (element.collider) {
    for (const colliderElement of physics.fieldElements) {
      if (
        colliderElement != element &&
        colliderElement.getBoundingBox &&
        element.getBoundingBox
      ) {
        for (const point of colliderElement.getBoundingBox()) {
          if (element.collider(element.getBoundingBox(), point)) {
            onCollision(element, colliderElement);
            break;
          }
        }
      }
    }
  }
};

const handleDestroys = (element, i) => {
  if (element.shouldDestroy) {
    physics.remove(element.id);
    physics.fieldElements.splice(parseInt(i), 1);
  }
};

physics.readKeys = (dt) => {
  const ship = physics.getById(`ship${playerNumber}`);
  if (keysPressed.includes("d")) {
    ship && ship.rotate(15 * dt);
  }

  if (keysPressed.includes("a")) {
    ship && ship.rotate(-15 * dt);
  }

  if (keysPressed.includes("w")) {
    ship && ship.moveForward(0);
  }

  if (keysPressed.includes("s")) {
    ship && ship.moveBackward(0);
  }
};

physics.update = (element, i, dt) => {
  if (element?.type === "bullet" && isHost) {
    element.update(dt);
    sendBulletPosition(socket, element, playerNumber);
  } else if (element?.type === "ship" && element.id === `ship${playerNumber}`) {
    element.update(dt);
    sendShipPosition(socket, element, playerNumber);
  }

  handleCollisions(element);

  if (
    element?.type === "ship" &&
    getDistance(element.posX, element.posY, 0, 0) > ring.size / 2
  ) {
    element.shouldDestroy = true;
  }

  handleDestroys(element, i);

  const ship = physics.getById(`ship${playerNumber}`);
  if (ship) {
    camera.x = -ship.posX + field.getBoundingClientRect().width / 2;
    camera.y = -ship.posY + field.getBoundingClientRect().height / 2;
  }

  if (!element.shouldDestroy) {
    element.draw(camera);
  }
};

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    toggleStop();
    return;
  }

  if (!keysPressed.includes(event.key)) {
    keysPressed.push(event.key);
  }
});

document.addEventListener("keyup", (event) => {
  keysPressed.splice(keysPressed.indexOf(event.key), 1);
});

document.addEventListener("click", (event) => {
  const ship = physics.getById(`ship${playerNumber}`);
  if (ship) {
    let bullet = null;
    bullet = ship.fire(physics, playerNumber);
    socket.send(
      JSON.stringify({
        type: "shoot",
        posX: bullet.posX,
        posY: bullet.posY,
        playerNumber,
        rotation: bullet.rotation,
        id: bullet.id,
      })
    );
  }
});
