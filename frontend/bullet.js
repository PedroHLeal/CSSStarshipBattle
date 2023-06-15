import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";

export default class Bullet extends PhysicsElement {
  html =
    '<div id=":id" style="width: 5px; height: 5px; border-radius: 3px; background-color: white; position: absolute; left: :left; top: :top"></div>';
  
  domElement = null;
  speed = 30;
  cretionTime = new Date().getTime();
  durationTime = 2000;
  type = "bullet";
  rotation = null;

  getBoundingBox = () => {
    return [{ x: this.posX, y: this.posY }];
  };

  constructor(id, rot, posX, posY, speed, parent) {
    super();
    this.id = id;
    this.html = this.html
      .replace(":id", id)
      .replace(":left", posX)
      .replace(":top", posY);
    this.speed = speed || this.speed
    this.velX = this.speed * Math.sin(rot);
    this.velY = -this.speed * Math.cos(rot);
    this.posX = posX;
    this.posY = posY;
    this.parent = parent;
    this.rotation = rot;
  }

  draw = (camera) => {
    this.domElement.style.left = (this.posX - 5 + camera.x).toString();
    this.domElement.style.top = (this.posY - 5 + camera.y).toString();
  };

  update(dt) {
    super.update(dt);
    if (new Date().getTime() - this.cretionTime > this.durationTime) {
      this.shouldDestroy = true;
    }
  }

  setFromMessage = (message) => {
    this.posX = message.posX;
    this.posY = message.posY;
  }
}
