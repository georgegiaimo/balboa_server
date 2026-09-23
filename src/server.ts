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
import { DocsRoute } from '@routes/docs.route';
import { MessagingRoute } from '@routes/messaging.route';
import { Server } from 'socket.io';
import { initSockets } from './sockets'; // Import your logic

import { GoogleService } from '@services/google.service';
import { GoogleRepository, type IGoogleRepository } from '@repositories/google.repository';
import { AirtableService } from '@services/airtable.service';
import { AirtableRepository, type IAirtableRepository } from '@repositories/airtable.repository';
import { pool } from './database.config';
import { CommonService } from './services/common.service';
import { GoogleRoute } from './routes/google.route';
import { EmailNotificationsRepository } from './repositories/email_notifications.repository';
import { SendGridService } from './services/sendgrid.service';
import { EmailNotificationsService } from './services/email_notifications';
import { ApisRepository } from './repositories/apis.repository';
import { ApisService } from './services/apis.service';
import { DocsService } from './services/docs.service';
import { LogsRoute } from './routes/logs.route';

//container.registerInstance(UsersRepository, new UsersRepository());

const routes = [
  container.resolve(UsersRoute), 
  container.resolve(AuthRoute), 
  container.resolve(ChatRoute), 
  container.resolve(SystemRoute),
  container.resolve(ReportsRoute),
  container.resolve(ApisRoute),
  container.resolve(DocsRoute),
  container.resolve(GoogleRoute),
  container.resolve(MessagingRoute),
  container.resolve(LogsRoute)
];

var commonService = new CommonService;
var emailNotificationsRepository = new EmailNotificationsRepository(pool);
var emailNotificationsService = new EmailNotificationsService(emailNotificationsRepository);
var googleRepository = new GoogleRepository(pool);
var emailNotificationsRepository = new EmailNotificationsRepository(pool);

var sendgridService = new SendGridService(commonService);
var emailNotificationsService = new EmailNotificationsService(emailNotificationsRepository);

const googleService = new GoogleService(googleRepository, commonService, sendgridService, emailNotificationsService);

var airtableRepository = new AirtableRepository(pool);
const airtableService = new AirtableService(airtableRepository);

var apisRepository = new ApisRepository(pool);
const apisService = new ApisService(apisRepository, commonService, sendgridService, emailNotificationsService);

const docsService = new DocsService(apisService, commonService, googleService);

const appInstance = new App(routes, '', googleService, airtableService, apisService, docsService);

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
