export function initSockets(initCallback, messageCallback, err) {
  let socket = null;

  try {
    socket = new WebSocket("ws://localhost:8000/ws/game/boobies/");
  } catch (e) {
    err(e);
  }

  socket.onopen = () => {
    initCallback(socket);
  };

  socket.onmessage = function (e) {
    const data = JSON.parse(e.data).message;
    messageCallback(data.type, data);
  };
}

export const sendShipPosition = (socket, ship, playerNumber) => {
  socket.send(
    JSON.stringify({
      type: "shipposition",
      playerNumber,
      rotation: ship.rotation,
      posX: ship.posX,
      posY: ship.posY,
      engineStatus: ship.engineStatus,
      isImmune: ship.isImmune
    })
  );
}

export const sendBulletPosition = (socket, bullet) => {
  socket.send(
    JSON.stringify({
      type: "bulletposition",
      posX: bullet.posX,
      posY: bullet.posY,
      id: bullet.id
    })
  );
}