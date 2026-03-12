"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSockets = void 0;
const chat_events_1 = require("./chat.events");
const initSockets = (io) => {
    console.log('sockets initialized...');
    io.on("connection", (socket) => {
        // 1. Connection-level logic (e.g., tracking online users)
        console.log(`User ${socket.id} connected`);
        // 2. Attach specialized handlers
        (0, chat_events_1.registerChatHandlers)(io, socket);
        socket.on("disconnect", () => {
            console.log("Cleanup logic here");
        });
    });
};
exports.initSockets = initSockets;
//# sourceMappingURL=index.js.map