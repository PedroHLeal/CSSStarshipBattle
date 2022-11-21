class Ship extends PhysicsElement {
    html = `<div 
        style="position: absolute"
        id=":id">
            <div style="width: 0;
                    height: 0;
                    border-bottom: 60px solid white;
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 0px solid transparent;"></div>
            <div id=":id-engine" 
                    style="width: 40px;
                            height: 15px;
                            background-color: white;
                            transition: opacity :optransitions;
                            background: linear-gradient(180deg, rgba(255,54,1,1) 0%, rgba(255,243,0,0.6382488479262673) 56%, rgba(255,243,0,0) 100%);">
                    </div> 
        </div>`
    domElement = null;
    rotation = 0;
    radRotation = 0;
    enginePower = 15;
    speedLimit = 25;
    currentSpeed = 0;
    lifes = 3;

    immunityTime = 3000;
    isImmune = false;
    damageTakenTime = 0;

    flickerState = true;
    flickerTime = 45;
    lastFlickerTime = 0;

    engineTurnOnTime = 0.5;
    engineStatus = 0;

    fireRate = 500;
    lastBulletShotOn = null;

    constructor(id) {
        super();
        this.id = id;
        this.html = this.html.replaceAll(':id', id).replace(':optransition', this.engineTurnOnTime);
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
        
        if (this.isImmune) {
            const currentTime = (new Date()).getTime();
            if (currentTime - this.damageTakenTime > this.immunityTime) {
                this.isImmune = false;
                this.flickerState = true;
            }
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
        
        const engine = document.getElementById(this.id + '-engine');
        engine.style.opacity = +this.engineStatus;
        this.domElement.style.opacity = +this.flickerState;
        this.domElement.style.left = (this.posX - 20).toString();
        this.domElement.style.top = (this.posY - 30).toString();
        this.domElement.style.transform = `rotate(${this.rotation}deg)`

        this.engineStatus = 0;
    }

    rotate = (deg) => {
        this.rotation += deg
        this.radRotation = this.rotation * Math.PI / 180;
    }

    moveForward = (turbo) => {
        this.engineStatus = 1;
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
        const currentTime = (new Date()).getTime();
        if (!this.lastBulletShotOn || currentTime - this.lastBulletShotOn > this.fireRate) {
            this.lastBulletShotOn = currentTime;
            const bullet = new Bullet("bullet" + (new Date()).getTime(), this.radRotation, this.posX, this.posY);
            physics.add(bullet);
        }
    }

    takeDamage = (direction) => {
        this.damageTakenTime = (new Date()).getTime();
        this.isImmune = true;
        this.lifes --;

        if (this.lifes < 0) {
            this.shouldDestroy = true;
        }

        this.velX = this.speedLimit * direction[0];
        this.velY = this.speedLimit * direction[1];
    }
}