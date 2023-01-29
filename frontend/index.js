import SomeJsPhysics from "./SomeJSPhysics/somephysicsjs/somejsphysics.js";
import { getDistance } from "./SomeJSPhysics/somephysicsjs/Utils/geometry.js";

import Ship from "./ship.js";
import Ring from "./ring.js";

let socket = null;

let field = null;
let physics = null;

let ring = new Ring();
let keysPressed = [];
let ship = null;
let ship2 = null;
let isHost = false;

try {
  socket = new WebSocket("ws://localhost:8000/ws/game/boobies/");
  initGame();
} catch (e) {
  console.log(e);
  console.log("could not connect to socket");
}

socket.onmessage = function (e) {
  console.log(e);
  switch (e.data.type) {
    case "setHost":
      isHost = true;
      break;
    case "addPlayer":
      addPlayer();
      break;
  }
};

function addPlayer() {}

function initGame() {
  field = document.getElementById("field");
  physics = new SomeJsPhysics("field");

  ring = new Ring();
  physics.add(ring);
  keysPressed = [];
  ship = new Ship("ship", false);
  physics.add(ship);
  physics.add(new Ship("ship2", false));

  ship.posX = 0;
  ship.posY = 0;

  ship2 = physics.getById("ship2");
  ship2.posX = 200;
  ship2.posY = 0;

  ship2 = null;
  ship = null;

  physics.start(60);

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
    const ship = physics.getById("ship");
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

  physics.postUpdate = (element, i) => {
    handleCollisions(element);

    if (
      element?.type === "ship" &&
      getDistance(element.posX, element.posY, 0, 0) > ring.size / 2
    ) {
      element.shouldDestroy = true;
    }

    handleDestroys(element, i);

    const ship = physics.getById("ship");
    if (ship) {
      physics.camera.x = -ship.posX + field.getBoundingClientRect().width / 2;
      physics.camera.y = -ship.posY + field.getBoundingClientRect().height / 2;
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
    const ship = physics.getById("ship");
    ship && ship.fire(physics);
    socket.send("tiro");
  });
}
