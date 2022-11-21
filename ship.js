class Ship extends PhysicsElement {
    html = `<div 
        id=":id"
        style="width: 0;
                height: 0;
                border-bottom: 60px solid white;
                border-left: 20px solid transparent;
                border-right: 20px solid transparent;
                border-top: 70px solid transparent;
                position: absolute">
        </div>`
    domElement = null;
    rotation = 0;
    radRotation = 0;
    enginePower = 5;
    speedLimit = 20;
    currentSpeed = 0;
    lifes = 3;

    immunityTime = 2000;
    isImmune = false;
    damageTakenTime = 0;

    flickerState = true;
    flickerTime = 100;
    lastFlickerTime = 0;

    constructor(id) {
        super();
        this.id = id;
        this.html = this.html.replace(':id', id);
    }

    update = (dt) => {
        this.accX = this.forceX * dt;
        this.accY = this.forceY * dt;

        this.velX = this.velX + this.accX * dt;
        this.velY = this.velY + this.accY * dt;

        this.currentSpeed = Math.sqrt(this.velX * this.velX + this.velY * this.velY);
        const direction = this.getDirection();

        if (this.currentSpeed > this.speedLimit) {
            this.velX = this.speedLimit * direction[0];
            this.velY = this.speedLimit * direction[1];
        }

        this.posX += this.velX * dt;
        this.posY += this.velY * dt;
        if (this.isImmune && ((new Date()).getTime() - this.damageTakenTime) > this.immunityTime) {
            this.isImmune = false;
            this.flickerState = true;
        }

        this.clearForces()
    };

    draw = () => {
        if (this.isImmune) {
            if ((new Date()).getTime() - this.lastFlickerTime > this.flickerTime) {
                this.flickerState = !this.flickerState;
                this.lastFlickerTime = (new Date()).getTime();
            }
        }

        this.domElement.style.opacity = +this.flickerState;
        this.domElement.style.left = (this.posX - 25).toString();
        this.domElement.style.top = (this.posY - 60).toString();
        this.domElement.style.transform = `rotate(${this.rotation}deg)`
    }

    rotate = (deg) => {
        this.rotation += deg
        this.radRotation = this.rotation * Math.PI / 180;
    }

    moveForward = (turbo) => {
        this.applyForceX((this.enginePower + turbo) * Math.sin(this.radRotation));
        this.applyForceY((-this.enginePower - turbo) * Math.cos(this.radRotation));
    }

    moveBackward = (turbo) => {
        this.applyForceX((-this.enginePower - turbo) * Math.sin(this.radRotation));
        this.applyForceY((this.enginePower + turbo) * Math.cos(this.radRotation));
    }

    getDirection = () => {
        const normalX = this.velX / this.currentSpeed;
        const normalY = this.velY / this.currentSpeed;

        return [normalX, normalY];
    }

    fire = (physics) => {
        const bullet = new Bullet("bullet" + physics.fieldElements.length, this.radRotation, this.posX, this.posY);
        physics.add(bullet);
    }

    takeDamage = () => {
        this.damageTakenTime = (new Date()).getTime();
        this.isImmune = true;
        this.lifes --;

        if (this.lifes < 0) {
            this.shouldDestroy = true;
        }
    }
}