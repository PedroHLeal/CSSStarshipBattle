import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";

export default class Ring extends PhysicsElement {
  id = "ring";
  size = 1600;
  domElement = null;
  html = `<div
        id="ring"
        style="position: absolute;
                width: ${this.size}px;
                height: ${this.size}px;
                border-radius: ${this.size/2}px;
                background-color: rgba(0, 0, 0, 0);
                border: 3px solid white;
                left: 0;
                top: 0;
                box-shadow:
                    0 0 24px 24px #fff,
                    0 0 40px 32px #f0f,
                    0 0 56px 56px #0ff;"></div>`;

  constructor() {
    super();
    this.posX = 0;
    this.posY = 0;
  }

  draw = (camera) => {
    this.domElement.style.left = this.posX + camera.x - this.size/2;
    this.domElement.style.top = this.posY + camera.y - this.size/2;
  };
}
