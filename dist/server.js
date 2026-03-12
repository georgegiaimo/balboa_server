"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("./config/env");
const tsyringe_1 = require("tsyringe");
const app_1 = __importDefault(require("./app"));
const users_repository_1 = require("./repositories/users.repository");
const auth_route_1 = require("./routes/auth.route");
const users_route_1 = require("./routes/users.route");
const chat_route_1 = require("./routes/chat.route");
const system_route_1 = require("./routes/system.route");
const reports_route_1 = require("./routes/reports.route");
const apis_route_1 = require("./routes/apis.route");
const socket_io_1 = require("socket.io");
const sockets_1 = require("./sockets"); // Import your logic
const google_service_1 = require("./services/google.service");
const google_repository_1 = require("./repositories/google.repository");
const airtable_service_1 = require("./services/airtable.service");
const airtable_repository_1 = require("./repositories/airtable.repository");
const database_config_1 = require("./database.config");
tsyringe_1.container.registerInstance(users_repository_1.UsersRepository, new users_repository_1.UsersRepository());
const routes = [
    tsyringe_1.container.resolve(users_route_1.UsersRoute),
    tsyringe_1.container.resolve(auth_route_1.AuthRoute),
    tsyringe_1.container.resolve(chat_route_1.ChatRoute),
    tsyringe_1.container.resolve(system_route_1.SystemRoute),
    tsyringe_1.container.resolve(reports_route_1.ReportsRoute),
    tsyringe_1.container.resolve(apis_route_1.ApisRoute)
];
var googleRepository = new google_repository_1.GoogleRepository(database_config_1.pool);
const googleService = new google_service_1.GoogleService(googleRepository);
var airtableRepository = new airtable_repository_1.AirtableRepository(database_config_1.pool);
const airtableService = new airtable_service_1.AirtableService(airtableRepository);
const appInstance = new app_1.default(routes, '', googleService, airtableService);
const server = appInstance.listen();
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" }
});
// Initialize all socket logic
(0, sockets_1.initSockets)(io);
if (server && typeof server.close === 'function') {
    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.on(signal, () => {
            console.log(`Received ${signal}, closing server...`);
            server.close(() => {
                console.log('HTTP server closed gracefully');
                process.exit(0);
            });
        });
    });
}
exports.default = server;
//# sourceMappingURL=server.js.map