import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";
import BurnTrail from "./burn-trail.js";
import global from "./global.js";

export default class Meteor extends PhysicsElement {
    physics = null;
    html = `
        <div id=":id" style="
            width: :widthpx;
            height: :heightpx;
            background-color: white;
            border-radius: :widthpx;
            position: absolute;
            z-index: 999999;
            top: :top;
            left: :left;
            "
        ></div>`;

  constructor(id, posX, posY, velX, velY, width, height) {
    super();
    this.id = id;
    this.posX = posX;
    this.posY = posY;
    this.velX = velX;
    this.velY = velY;
    this.width = width;
    this.height = height;
    this.html = this.html
        .replace(":top", this.posY)
        .replace(":left", this.posX)
        .replace(":id", this.id)
        .replaceAll(":width", this.width)
        .replace(":height", this.height);
    global.physics.add(new BurnTrail(this))
  }

  draw = (camera) => {
    this.domElement.style.top = this.posY + camera.y - this.width/2;
    this.domElement.style.left = this.posX + camera.x - this.height/2;
  };

  update = (dt) => {
    super.update(dt);

    if (Math.abs(this.posX) > 1000 || Math.abs(this.posY) > 1000) {
      this.shouldDestroy = true;
    }
  }
}
