import global from "./global.js";
import Meteor from "./meteor.js";

let difficulty = 1;
let isCurrentlyInMeteorField = false;
let lastMeteorFieldCreationTime = 0;
let lastMeteorCreationTime = 0;
const meteorBaseNumber = 5;

const generateMeteorField = () => {
  if (new Date().getTime() - lastMeteorCreationTime > 1000 / difficulty) {
    global.physics.add(
      new Meteor(`meteor-${new Date().getTime()}`, 0, 0, 5, 5, 70, 70)
    );
    lastMeteorCreationTime = new Date().getTime();
  }
};

const setMeteorFields = () => {
  if (
    !isCurrentlyInMeteorField &&
    new Date().getTime() - lastMeteorFieldCreationTime > 1000
  ) {
    generateMeteorField();
  }
};

export default setMeteorFields;
