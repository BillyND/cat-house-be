const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const express = require("express");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const app = express();

// Set up socket.io server
const httpServer = http.createServer(app);
const io = socketio(httpServer, {
  cors: {
    origin: "*",
  },
});

let users = [];

// Socket.io functions
const handleUpdatePost = (post) => {
  io.emit("getPost", post);
};

const handleUpdateComment = (post) => {
  io.emit("getComment", post);
};

const handleChangeData = (data) => {
  comments = data;
  io.emit("getData", initData);
};

const handleAddUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
  io.emit("getUsers", users);
};

const handleSendMessage = ({ senderId, receiverId, text }) => {
  const user = getUser(receiverId);
  io.to(user?.socketId).emit("getMessage", { senderId, text });
};

const handleDisconnect = (socketId) => {
  io.emit("getUsers", users);
};

// Socket.io event listeners
io.on("connection", (socket) => {
  // Post
  socket.on("updatePost", handleUpdatePost);

  //Comment
  socket.on("updateComment", handleUpdateComment);
  socket.on("changeData", handleChangeData);
  socket.on("addUser", (userId) => handleAddUser(userId, socket.id));
  socket.on("sendMessage", handleSendMessage);
  socket.on("disconnect", () => handleDisconnect(socket.id));
});

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(router);

const PORT = 8089;

// Connect to the database and start the server
(async () => {
  try {
    httpServer.listen(8089, () =>
      console.log(`<=== Socket is running on port ${8089} ===>`)
    );
  } catch (error) {
    console.log("===> Error connecting to the database", error);
  }
})();
