const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Cambia esto si es necesario
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: "http://localhost:5173" // Cambia esto si es necesario
}));
app.use(express.json());

let chats = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  // Manejo del evento sendMessage para recibir y emitir mensajes con el campo isAdmin
  socket.on('sendMessage', (message) => {
    const messageWithId = { ...message, id: Date.now() };
    chats.push(messageWithId);
    io.emit('receiveMessage', messageWithId);
    console.log(`Message received: ${messageWithId.message}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.get('/chats', (req, res) => {
  res.json(chats);
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
