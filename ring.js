class Ring extends PhysicsElement {
    id = "ring";
    domElement = null;
    html = `<div
        id="ring"
        style="position: absolute;
                width: 1400px;
                height: 1400px;
                border-radius: 700px;
                background-color: rgba(0, 0, 0, 0);
                border: 3px solid white;
                left: 0;
                top: 0;
                box-shadow:
                    0 0 3px 3px #fff,
                    0 0 5px 4px #f0f,
                    0 0 7px 7px #0ff;"></div>`;

    
    constructor() {
        super();
        this.posX = 0;
        this.posY = 0;
    }

    draw = (camera) => {
        this.domElement.style.left = this.posX + camera.x - 700;
        this.domElement.style.top = this.posY + camera.y - 700;
    }
}