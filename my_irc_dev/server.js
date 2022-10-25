const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, '/public')));

io.on('connection', (socket) => {
  const date = new Date();
  
  console.log(`new user connected ${date}`);

  
  socket.emit('message', `Bienvenue!!`);
  
  // a tout le monde sauf a la person concerner
  socket.broadcast.emit('message', 'A user has joined!');
  
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!');
  });
  
  //listen msg from iencli
  socket.on('chatMessage', msg => {
    io.emit('chatMessage', msg);
    console.log(msg);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`listening on port: ${port}`);
});