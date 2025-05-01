const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
require("dotenv").config();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO on the same server
const io = new Server(server, {
  cors: {
    origin: "*", // Consider restricting this in production
    methods: ["GET", "POST"],
  },
});

// Pass the `io` instance to your socket logic
require("./socket/chatSocket")(io);

// Start the HTTP + WebSocket server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
