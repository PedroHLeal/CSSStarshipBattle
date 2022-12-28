socket = null;
initSocket();

function initSocket() {
  socket = new WebSocket("ws://localhost:8000/ws/game/boobies/");
}

socket.onmessage = function (e) {
  console.log(e)
};

socket.onclose = function () {
  initSocket();
};
