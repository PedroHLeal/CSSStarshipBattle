class Bullet extends PhysicsElement {
    html = '<div id=":id" style="width: 10px; height: 10px; border-radius: 3px; background-color: white; position: absolute; left: :left; top: :top"></div>'
    domElement = null;
    speed = 70;
    cretionTime = (new Date()).getTime();
    durationTime = 2000;

    constructor(id, rot, posX, posY) {
        super();
        this.id = id;
        this.html = this.html.replace(':id', id).replace(':left', posX).replace(':top', posY);
        this.velX = this.speed * Math.sin(rot);
        this.velY = -this.speed * Math.cos(rot);
        this.posX = posX;
        this.posY = posY;
    }

    draw = () => {
        this.domElement.style.left = (this.posX - 5).toString();
        this.domElement.style.top = (this.posY - 5).toString();
    }

    update(dt) {
        super.update(dt);
        if ((new Date()).getTime() - this.cretionTime > this.durationTime) {
            this.shouldDestroy = true;
        }
    }
}