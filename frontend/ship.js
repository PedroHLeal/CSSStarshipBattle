import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";
import triangleCollider from "./SomeJSPhysics/somephysicsjs/Collision/TriangleCollider.js";

import Bullet from "./bullet.js";

export default class Ship extends PhysicsElement {
  html = `<div 
        style="position: absolute"
        id=":id">
            <div style="width: 0;
                    height: 0;
                    border-bottom: :heightpx solid white;
                    border-left: :widthpx solid transparent;
                    border-right: :widthpx solid transparent;
                    border-top: 0px solid transparent"></div>
            <div id=":id-engine" 
                    style="width: 40px;
                            height: 15px;
                            background-color: white;
                            transition: opacity :optransitions;
                            background: linear-gradient(180deg, rgba(255,54,1,1) 0%, rgba(255,243,0,0.6382488479262673) 56%, rgba(255,243,0,0) 100%);">
                    </div> 
        </div>`;
  domElement = null;
  rotation = 0;
  radRotation = 0;
  enginePower = 10;
  speedLimit = 20;
  currentSpeed = 0;
  lifes = 3;
  height = 60;
  width = 40;

  immunityTime = 3000;
  isImmune = false;
  damageTakenTime = 0;
  destroyAnimationTime = 1;

  flickerState = true;
  flickerTime = 45;
  lastFlickerTime = 0;

  engineTurnOnTime = 0.5;
  engineStatus = 0;

  fireRate = 500;
  lastBulletShotOn = null;
  debug = false;
  collider = triangleCollider;
  type = "ship";
  isDestroying = false;
  bulletSpeed = 30;

  getBoundingBox = () => {
    return [
      { x: this.posX, y: this.posY - 30 },
      { x: this.posX - 20, y: this.posY + 30 },
      { x: this.posX + 20, y: this.posY + 30 },
    ];
  };

  constructor(id, debug) {
    super();
    this.id = id;
    this.debug = debug;
    if (debug) {
      this.html += `<div style="position: absolute; width: 4px; height: 4px; background-color: green;" id=":id-debug-1"></div>`;
      this.html += `<div style="position: absolute; width: 4px; height: 4px; background-color: green;" id=":id-debug-2"></div>`;
      this.html += `<div style="position: absolute; width: 4px; height: 4px; background-color: green;" id=":id-debug-3"></div>`;
    }
    this.html = this.html
      .replaceAll(":id", id)
      .replace(":optransition", this.engineTurnOnTime)
      .replace(":height", this.height)
      .replaceAll(":width", this.width / 2)
      .replace(":destroyAnimationTime", this.destroyAnimationTime);
  }

  update = (dt) => {
    this.accX = this.forceX * dt;
    this.accY = this.forceY * dt;

    this.velX = this.velX + this.accX * dt;
    this.velY = this.velY + this.accY * dt;

    this.currentSpeed = Math.sqrt(
      this.velX * this.velX + this.velY * this.velY
    );
    const direction = this.getDirection();

    if (this.currentSpeed > this.speedLimit) {
      this.velX = this.speedLimit * direction[0];
      this.velY = this.speedLimit * direction[1];
    }

    this.posX += this.velX * dt;
    this.posY += this.velY * dt;

    if (this.isImmune) {
      const currentTime = new Date().getTime();
      if (currentTime - this.damageTakenTime > this.immunityTime) {
        this.isImmune = false;
        this.flickerState = true;
      }
    }

    this.clearForces();
  };

  draw = (camera) => {
    if (this.isImmune) {
      if (new Date().getTime() - this.lastFlickerTime > this.flickerTime) {
        this.flickerState = !this.flickerState;
        this.lastFlickerTime = new Date().getTime();
      }
    }

    const engine = document.getElementById(this.id + "-engine");
    engine.style.opacity = +this.engineStatus;
    this.domElement.style.opacity = +(
      !this.isImmune ||
      (this.isImmune && this.flickerState)
    );
    this.domElement.style.left = (this.posX + camera.x - 20).toString();
    this.domElement.style.top = (this.posY + camera.y - 30).toString();
    this.domElement.style.transform = `rotate(${this.rotation}deg)`;

    if (this.debug) {
      const d1 = document.getElementById(this.id + "-debug-1");
      const d2 = document.getElementById(this.id + "-debug-2");
      const d3 = document.getElementById(this.id + "-debug-3");
      const box = this.getBoundingBox();
      d1.style.left = box[0].x;
      d1.style.top = box[0].y;
      d2.style.left = box[1].x;
      d2.style.top = box[1].y;
      d3.style.left = box[2].x;
      d3.style.top = box[2].y;
    }

    this.engineStatus = 0;
  };

  rotate = (deg) => {
    this.rotation += deg;
    this.radRotation = (this.rotation * Math.PI) / 180;
  };

  moveForward = (turbo) => {
    this.engineStatus = 1;
    this.applyForceX((this.enginePower + turbo) * Math.sin(this.radRotation));
    this.applyForceY((-this.enginePower - turbo) * Math.cos(this.radRotation));
  };

  moveBackward = (turbo) => {
    this.applyForceX((-this.enginePower - turbo) * Math.sin(this.radRotation));
    this.applyForceY((this.enginePower + turbo) * Math.cos(this.radRotation));
  };

  getDirection = () => {
    const normalX = this.velX / this.currentSpeed;
    const normalY = this.velY / this.currentSpeed;

    return [normalX, normalY];
  };

  fire = (physics, playerNumber) => {
    const currentTime = new Date().getTime();
    if (
      !this.lastBulletShotOn ||
      currentTime - this.lastBulletShotOn > this.fireRate
    ) {
      this.lastBulletShotOn = currentTime;
      const bullet = new Bullet(
        `bullet-${playerNumber}-${new Date().getTime()}`,
        this.posX + (this.height / 2 + 15) * Math.sin(this.radRotation),
        this.posY - (this.height / 2 + 15) * Math.cos(this.radRotation),
        this.velX + this.bulletSpeed * Math.sin(this.radRotation),
        this.velY - this.bulletSpeed * Math.cos(this.radRotation),
        this
      );
      physics.add(bullet);
      return bullet;
    }
  };

  takeDamage = (direction) => {
    this.damageTakenTime = new Date().getTime();
    this.isImmune = true;
    this.lifes--;

    if (this.lifes < 0) {
      this.shouldDestroy = true;
    }

    this.velX = this.speedLimit * direction[0];
    this.velY = this.speedLimit * direction[1];
  };

  setFromMessage = (message) => {
    this.posX = message.posX;
    this.posY = message.posY;
    this.rotation = message.rotation;
    this.engineStatus = message.engineStatus;
    this.isImmune = message.isImmune;
  };
}
