const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const socketIO = require("socket.io");
const { Server } = require("socket.io");
const { Socket } = require("dgram");
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User : ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive", data)
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        io.emit('message', 'User');
    });
})

const port = process.env.PORT || 3002;

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});