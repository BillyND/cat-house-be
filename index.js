const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);
server.use(router);

const PORT = 8089;

server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
