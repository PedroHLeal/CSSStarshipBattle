export default function (initCallback, messageCallback, err) {
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
