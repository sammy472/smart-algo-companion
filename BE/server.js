import app from './src/app.js';
import db from './src/database/client.js';
import { Server } from 'socket.io';
import { config } from 'dotenv';
config();

app.use((req, res, next) => {
  req.db = db;
  next();
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('sendMessage', ({ from, to, message }) => {
    io.emit('receiveMessage', { from, to, message });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});