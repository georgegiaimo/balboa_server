import { Server, Socket } from 'socket.io';
import { registerChatHandlers } from './chat.events';

export const initSockets = (io: Server) => {
    console.log('sockets initialized...');
  io.on("connection", (socket: Socket) => {
    // 1. Connection-level logic (e.g., tracking online users)
    console.log(`User ${socket.id} connected`);

    // 2. Attach specialized handlers
    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
       console.log("Cleanup logic here");
    });
  });
};