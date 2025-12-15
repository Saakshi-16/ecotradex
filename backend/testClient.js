const { io } = require("socket.io-client");

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Connected as:", socket.id);

  socket.emit("login", "testuser@example.com");

  socket.emit("subscribe", ["GOOG", "TSLA"]);
});

socket.on("price_update", (data) => {
  console.log("Live Prices:", data);
});
