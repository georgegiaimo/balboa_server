"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerChatHandlers = void 0;
const registerChatHandlers = (io, socket) => {
    // 1. Listen for a user sending a message
    const sendMessage = (payload) => {
        console.log(`Message from ${payload.sender}: ${payload.message}`);
        // Broadcast to everyone else
        // Use io.emit to include the sender, or socket.broadcast.emit to exclude them
        io.emit("chat:receive-message", {
            ...payload,
            timestamp: new Date().toISOString()
        });
    };
    // 2. Listen for "User is typing" status
    const typingStatus = (data) => {
        socket.broadcast.emit("chat:typing", data);
    };
    // 3. Join a specific chat room
    const joinRoom = (roomName) => {
        socket.join(roomName);
        console.log(`User ${socket.id} joined room: ${roomName}`);
    };
    // Register the listeners on the socket
    socket.on("chat:send-message", sendMessage);
    socket.on("chat:typing", typingStatus);
    socket.on("chat:join-room", joinRoom);
};
exports.registerChatHandlers = registerChatHandlers;
//# sourceMappingURL=chat.events.js.map