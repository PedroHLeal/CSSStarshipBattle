import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";

export default class Ring extends PhysicsElement {
  id = "ring";
  size = 1600;
  domElement = null;
  html = `<div
            id="ring"
            style="position: absolute;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: ${this.size}px;
                    height: ${this.size}px;
                    border-radius: ${this.size/2}px;
                    background-image: url('2k_jupiter.jpg');
                    border: 3px solid white;
                    left: 0;
                    top: 0;
                    box-shadow:
                        0 0 24px 24px #fff,
                        0 0 40px 32px #f0f,
                        0 0 56px 56px #0ff;">
              
                <div style="
                  position: relative;

                  width: 100%;
                  height: 100%;
                  border-radius: ${this.size/2}px;
                  background-color: rgba(0, 0, 0, 0.9)
                "></div>
          </div>`;

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
