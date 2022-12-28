const field = document.getElementById("field");
let physics = new SomeJsPhysics("field");

physics.add(new Ring());
keysPressed = [];
ship = new Ship("ship", false);
physics.add(ship);
physics.add(new Ship("ship2", false));

ship.posX = 0;
ship.posY = 0;

let ship2 = physics.getById("ship2");
ship2.posX = 200;
ship2.posY = 0;

ship2 = null;
ship = null;

physics.start(60);

toggleStop = () => {
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
}

const handleDestroys = (element, i) => {
  if (element.shouldDestroy) {
    physics.remove(element.id);
    physics.fieldElements.splice(parseInt(i), 1);
  }
}

physics.readKeys = (dt) => {
  const ship = physics.getById("ship");
  if (this.keysPressed.includes("d")) {
    ship && ship.rotate(15 * dt);
  }

  if (this.keysPressed.includes("a")) {
    ship && ship.rotate(-15 * dt);
  }

  if (this.keysPressed.includes("w")) {
    ship && ship.moveForward(0);
  }

  if (this.keysPressed.includes("s")) {
    ship && ship.moveBackward(0);
  }
};

physics.postUpdate = (element, i) => {
  handleCollisions(element);

  if (element?.type === "ship" && getDistance(element.posX, element.posY, 0 , 0) > 700) {
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
});
