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

const users = [];

const yann = "yannnnn";

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('newUser', (data) => {

    })

    socket.on("join_room", (data) => {
        // console.log(Object.keys(io.engine.clients)); // get all iencli
        console.log(socket.id);
        users.push({
            username: data.username,
            id: socket.id,
            room: data.room,
        });
        socket.join(data.room);
        console.log(io.sockets.adapter.rooms);
        console.log(`User : ${data.username} joined room: ${data.room}`);
    });

    socket.on("notif", (data) => {
        socket.to(data.room).emit("notif", data);
    });

    socket.on("send_message", (data) => {
        console.log(data);
        socket.to(data.room).emit("receive", data)
    });

    socket.on("disconnect", () => {
        console.log("User disconnected: ", socket.id);
        console.log("begin");
        console.log(users);
        const result = users.find(({ id }) => id === socket.id)
        for(var i = 0; i < users.length; i++) {
            if(users[i] === result) {
                users.splice(i, 1);
            }
        }
        console.log("end");
        console.log(users);
        io.emit('message', 'User');
    });
})

const port = process.env.PORT || 3002;

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});