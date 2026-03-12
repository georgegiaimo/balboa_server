import 'reflect-metadata';
import '@config/env';
import { container } from 'tsyringe';
import App from '@/app';
import { UsersRepository } from '@repositories/users.repository';
import { AuthRoute } from '@routes/auth.route';
import { UsersRoute } from '@routes/users.route';
import { ChatRoute } from '@routes/chat.route';
import { SystemRoute } from '@routes/system.route';
import { ReportsRoute } from '@routes/reports.route';
import { ApisRoute } from '@routes/apis.route';
import { Server } from 'socket.io';
import { initSockets } from './sockets'; // Import your logic

import { GoogleService } from '@services/google.service';
import { GoogleRepository, type IGoogleRepository } from '@repositories/google.repository';
import { AirtableService } from '@services/airtable.service';
import { AirtableRepository, type IAirtableRepository } from '@repositories/airtable.repository';
import { pool } from './database.config';

container.registerInstance(UsersRepository, new UsersRepository());

const routes = [
  container.resolve(UsersRoute), 
  container.resolve(AuthRoute), 
  container.resolve(ChatRoute), 
  container.resolve(SystemRoute),
  container.resolve(ReportsRoute),
  container.resolve(ApisRoute)
];

var googleRepository = new GoogleRepository(pool);
const googleService = new GoogleService(googleRepository);

var airtableRepository = new AirtableRepository(pool);
const airtableService = new AirtableService(airtableRepository);
const appInstance = new App(routes, '', googleService, airtableService);

const server = appInstance.listen();

const io = new Server(server, {
  cors: { origin: "*" }
});

// Initialize all socket logic
initSockets(io);

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

export default server;
