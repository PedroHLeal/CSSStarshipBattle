import Drawable from "./SomeJSPhysics/somephysicsjs/Drawable.js";
import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";
import global from "./global.js";

class TrailParticle extends Drawable {
  domElement = null;
  isFading = false;
  trailTime = null;
  fadeRate = 1;
  currentFadeTime = 0;
  html = `<div id=:id
        style="
            background-color: rgb(40, 40, 150);
            opacity: 0.6;
            width: 70px;
            height: 70px;
            border-radius: 70px;
            position: absolute;
            top: :trailTop;
            left: :trailLeft;
            transform: translate(-50%, -50%)">
        </div>`;
  creationTime = null;

  constructor(id, trailTime, posX, posY) {
    super();
    this.id = id;
    this.creationTime = new Date();
    this.trailTime = trailTime;
    this.posX = posX;
    this.posY = posY;
    this.html = this.html
      .replace(":id", id)
      .replace(":trailLeft", posX + global.camera.x)
      .replace(":trailTop", posY + global.camera.y);
  }

  draw = (camera) => {
    this.currentFadeTime += global.dt * 50;
    this.domElement.style.opacity = (-0.6)*(this.currentFadeTime/this.trailTime) + 0.6;
    this.domElement.style.width = (-70)*(this.currentFadeTime/this.trailTime) + 70;
    this.domElement.style.height = (-70)*(this.currentFadeTime/this.trailTime) + 70;
    this.domElement.style.backgroundColor = `rgb(${(200)*(this.currentFadeTime/this.trailTime) + 40}, 40, ${(-150)*(this.currentFadeTime/this.trailTime) + 150})`;
    this.domElement.style.left = (this.posX + camera.x).toString();
    this.domElement.style.top = (this.posY + camera.y).toString();

    if (new Date() - this.creationTime > this.trailTime) {
      this.shouldDestroy = true;
    }
  };

  update = () => {};
}

export default class BurnTrail extends PhysicsElement {
  physics = null;
  lastTrailParticle = null;

  html = `<div id=":id" 
        style="
            background-color: rgb(40, 40, 150);
            opacity: 0.4;
            width: :widthpx;
            height: :heightpx;
            border-radius: 70px;
            position: absolute;
            top: :top; left: :left">
        </div>`;

  constructor(parent, offsetX, offsetY) {
    super();
    this.parent = parent;
    this.id = this.parent.id + "burn-trail";
    this.width = parent.width + 30;
    this.height = parent.height + 30;
    this.posX = parent.posX;
    this.posY = parent.posY;

    this.html = this.html
      .replace(":id", this.parent.id + "burn-trail")
      .replace(":width", this.width)
      .replace(":height", this.height)
      .replace(":top", this.posX)
      .replace(":left", this.posY);
  }

  update = () => {
    if (!this.lastTrailParticle || new Date() - this.lastTrailParticle > 300) {
      this.lastTrailParticle = new Date();
      global.physics.add(
        new TrailParticle(
          `${this.id}-trail-particle-${(new Date()).getTime()}`,
          2000,
          this.posX,
          this.posY
        )
      );
    }
    this.posX = this.parent.posX;
    this.posY = this.parent.posY;
  };

  draw = (camera) => {
    this.domElement.style.top = this.posY + camera.y - this.height / 2;
    this.domElement.style.left = this.posX + camera.x - this.width / 2;
  };
}
