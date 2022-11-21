const field = document.getElementById('field');
let physics = new SomeJsPhysics('field');

keysPressed = [];
ship = new Ship("ship");
physics.add(ship)

ship.posX = field.getBoundingClientRect().width/2;
ship.posY = field.getBoundingClientRect().height/2;

physics.start(60);

toggleStop = () => {
    if (physics.running) {
        physics.stop();
        field.style.backgroundColor = '#333';
    } else {
        physics.start(60);
        field.style.backgroundColor = '#000';
    }
}

physics.readKeys = () => {
    if (this.keysPressed.includes('d')) {
        ship.rotate(5)
    }

    if (this.keysPressed.includes('a')) {
        ship.rotate(-5)
    }

    if (this.keysPressed.includes('w')) {
        ship.moveForward(0)
    }

    if (this.keysPressed.includes('s')) {
        ship.moveBackward(0)
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        toggleStop();
        return;
    }

    if (!keysPressed.includes(event.key)) {
        keysPressed.push(event.key);
    }
});

document.addEventListener('keyup', (event) => {
    keysPressed.splice(keysPressed.indexOf(event.key), 1);
});

document.addEventListener('click', (event) => {
    ship.fire(physics);
});
