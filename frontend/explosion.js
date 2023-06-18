import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";

export default class Explosion extends PhysicsElement {
  htmlExplosionStarted =
    '<div id=":id" style="width: 2px; height: 2px; border:1px solid #ffbb00; opacity: 0.8; border-radius: 100px; position: absolute; top: :top; left: :left; transition: width 2s, height 2s, opacity 2s, border-color 2s, border-width 2s;z-index: 9999; transform-origin: center center"></div>';
  styleExplosioAnimation =
    "width: 70px; height: 70px; opacity: 0; border-color: #ff0000; border-width: 10px";
  domElement = null;
  shouldDestroy = false;
  dateAdded = null;

  constructor(id, posX, posY) {
    super();
    this.id = id;
    this.dateAdded = new Date();
    this.posX = posX;
    this.posY = posY;
    this.html = this.htmlExplosionStarted
      .replace(":id", id)
      .replace(":left", posX)
      .replace(":top", posY);

    // setTimeout(() => {
    //     this.shouldDestroy = true;
    // }, 2500)
  }

  draw = (camera) => {
    if (new Date() - this.dateAdded > 2) {
      this.domElement.style.cssText += this.styleExplosioAnimation;
    }

    if (new Date() - this.dateAdded > 2000) {
      this.shouldDestroy = true;
    }

    this.domElement.style.left = (this.posX - 1 + camera.x).toString();
    this.domElement.style.top = (this.posY - 1 + camera.y).toString();
  };
}
