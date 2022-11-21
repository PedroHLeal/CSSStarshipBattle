class Bullet extends PhysicsElement {
    html = '<div id=":id" style="width: 6px; height: 6px; border-radius: 3px; background-color: white; position: absolute"></div>'
    domElement = null;
    speed = 50;
    cretionTime = (new Date()).getTime();
    durationTime = 500;

    constructor(id, rot, posX, posY) {
        super();
        this.id = id;
        this.html = this.html.replace(':id', id);
        this.velX = this.speed * Math.sin(rot);
        this.velY = -this.speed * Math.cos(rot);
        this.posX = posX;
        this.posY = posY;
    }

    draw = () => {
        this.domElement.style.left = (this.posX - 3).toString();
        this.domElement.style.top = (this.posY - 3).toString();
    }

    update(dt) {
        super.update(dt);
        if ((new Date()).getTime() - this.cretionTime > this.durationTime) {
            this.shouldDestroy = true;
        }
    }
}