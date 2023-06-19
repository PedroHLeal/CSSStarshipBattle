import SomeJsPhysics from "./SomeJSPhysics/somephysicsjs/somejsphysics.js";
import { getDistance } from "./SomeJSPhysics/somephysicsjs/Utils/geometry.js";
import {
  initSockets,
  sendBulletPosition,
  sendShipPosition,
} from "./sockets.js";
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
      case "shoot":
        if (message.playerNumber !== playerNumber) {
          addBullet(message);
        }
        break;
      case "bullet-hit":
        if (message.playerNumber !== playerNumber) {
          const ship = physics.getById(message.shipId);
          const bullet = physics.getById(message.bulletId);
          bulletHit(ship, bullet);
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
  const bullet = new Bullet(
    message.id,
    message.rotation,
    message.posX,
    message.posY,
    message.speed
  );
  physics.add(bullet);
}

function bulletHit(ship, bullet) {
  ship.takeDamage([0, 0]);
  let explosion = new Explosion(
    `${bullet.id}-explosion`,
    bullet.posX,
    bullet.posY
  );
  physics.add(explosion);
  bullet.shouldDestroy = true;
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
    socket.send(
      JSON.stringify({
        type: "bullet-hit",
        bulletId: collider.id,
        shipId: element.id
      })
    )
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
    physics.remove(element);
  }
};

const handleShipExitingRing = (element) => {
  if (
    element?.type === "ship" &&
    getDistance(element.posX, element.posY, 0, 0) > ring.size / 2
  ) {
    element.shouldDestroy = true;
    physics.add(
      new Explosion(
        `${element.id}-explosion`,
        element.posX - element.width / 4,
        element.posY - element.height / 4
      )
    );
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
  element.update(dt);

  if (element?.type === "ship" && element.id === `ship${playerNumber}`) {
    sendShipPosition(socket, element, playerNumber);
  }

  if (isHost) {
    handleCollisions(element);
  }
  handleShipExitingRing(element);

  const ship = physics.getById(`ship${playerNumber}`);
  if (ship) {
    camera.x = -ship.posX + field.getBoundingClientRect().width / 2;
    camera.y = -ship.posY + field.getBoundingClientRect().height / 2;
  }

  if (!element.shouldDestroy) {
    element.draw(camera);
  }

  handleDestroys(element, i);
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
  const bullet = ship?.fire(physics, playerNumber);
  if (ship && bullet) {
    socket.send(
      JSON.stringify({
        type: "shoot",
        posX: bullet.posX,
        posY: bullet.posY,
        playerNumber,
        rotation: bullet.rotation,
        id: bullet.id,
        speed: bullet.speed,
      })
    );
  }
});
