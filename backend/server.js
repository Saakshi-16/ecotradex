const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

// Create HTTP + WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Supported stock tickers
const STOCKS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

// Store stock prices
let prices = {};

// Initialize random base prices
STOCKS.forEach((ticker) => {
  prices[ticker] = 100 + Math.random() * 100;
});

// Store subscriptions (socket.id -> array of stocks)
let subscriptions = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("login", (email) => {
    console.log("Logged in:", email);
    subscriptions[socket.id] = [];
  });

  socket.on("subscribe", (userStocks) => {
    subscriptions[socket.id] = userStocks;
    console.log("Updated subscriptions:", subscriptions);
  });

  socket.on("disconnect", () => {
    delete subscriptions[socket.id];
    console.log("User disconnected:", socket.id);
  });
});

// Update stock prices every second
setInterval(() => {
  // Randomly update prices
  STOCKS.forEach((ticker) => {
    prices[ticker] += (Math.random() - 0.5) * 2;
    prices[ticker] = Number(prices[ticker].toFixed(2));
  });

  // Send only subscribed stock prices to each user
  Object.keys(subscriptions).forEach((socketId) => {
    const userStocks = subscriptions[socketId];
    const filteredPrices = {};

    userStocks.forEach((ticker) => {
      filteredPrices[ticker] = prices[ticker];
    });

    io.to(socketId).emit("price_update", filteredPrices);
  });
}, 1000);

// ✅ IMPORTANT: Use environment PORT for deployment
const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
