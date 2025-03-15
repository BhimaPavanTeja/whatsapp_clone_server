const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
// const socketIO = require("socket.io");
const { Server } = require("socket.io");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);

dotenv.config();
const port = process.env.PORT || 3001;

// *database
require("./db/connection");

// *cors
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "http://localhost:3005",
  "http://localhost:3006",
  "http://localhost:3007",
  "https://whatsapp-clone-ted.web.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cors());
// app.use(cors(corsOptions));

// Create socket.io server instance
const io = new Server(server, {
  cors: {
    origin: allowedOrigins[1],
    methods: ["GET", "POST"],
  },
});

// Handle socket connections
io.on("connection", (socket) => {
  console.log("User connected :", socket.id);

  // Handle incoming messages
  socket.on("chat_message", async (messageData) => {
    const message = new Message({
      content: messageData.content,
      fromUid: messageData.fromUid,
      toUid: messageData.toUid,
      files: messageData.filesArray,
    });

    console.log(messageData);
    // Save the message to the database
    try {
      const savedMessage = await message.save();
      console.log("Message saved to the database:", savedMessage);
      // You can emit a confirmation event back to the sender
      socket.emit("message_saved", savedMessage);
      // Broadcast the message to all connected clients
      socket.broadcast.emit("message_saved", savedMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
});

//  *shiftupwards

// Handle disconnections
// socket.on("disconnect", () => {
//   console.log("User disconnected");
// });

// linking express router
app.use(require("./router/route"));
app.use(require("./router/msgRoutes"));

// app.listen(port, () => {
//   console.log(`server is up and running at the port ${port}.`);
// });
server.listen(3001, () => {
  console.log(`Socket server is live on port ${port}!`);
});
