import { Server, Socket } from 'socket.io';

export const registerChatHandlers = (io: Server, socket: Socket) => {
  
  // 1. Listen for a user sending a message
  const sendMessage = (payload: { sender: string, message: string }) => {
    console.log(`Message from ${payload.sender}: ${payload.message}`);
    
    // Broadcast to everyone else
    // Use io.emit to include the sender, or socket.broadcast.emit to exclude them
    io.emit("chat:receive-message", {
      ...payload,
      timestamp: new Date().toISOString()
    });
  };

  // 2. Listen for "User is typing" status
  const typingStatus = (data: { user: string, isTyping: boolean }) => {
    socket.broadcast.emit("chat:typing", data);
  };

  // 3. Join a specific chat room
  const joinRoom = (roomName: string) => {
    socket.join(roomName);
    console.log(`User ${socket.id} joined room: ${roomName}`);
  };

  // Register the listeners on the socket
  socket.on("chat:send-message", sendMessage);
  socket.on("chat:typing", typingStatus);
  socket.on("chat:join-room", joinRoom);
};