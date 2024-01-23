import PhysicsElement from "./SomeJSPhysics/somephysicsjs/PhysicsElement.js";

export default class Backdrop extends PhysicsElement {
    domElement = null
    id = "backdrop";
    html = `
        <div 
            id="backdrop"
            style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background-color: rgba(0, 0, 0, 0.6);
                opacity: 0;
                z-index: 9999;
                transition: all 1s"
        >
            <div style="margin-top: 150px; color: white; font-family: 'Lucida Console', 'Courier New', monospace; font-size: 1.5rem">You're dead... Wait for the round to end</div>
        </div>
    `;

    draw = () => {
        if (this.domElement) {
            setTimeout(() => {
                this.domElement.style.opacity = 1
            }, 100);
        }
    }
}