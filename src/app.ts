import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { NODE_ENV, PORT, LOG_FORMAT, CREDENTIALS } from '@config/env';

import 'reflect-metadata'; // Must be first
import './database.config';

import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { NotFoundMiddleware } from '@middlewares/notFound.middleware';
import { logger, stream } from '@utils/logger';

import { GoogleService } from '@services/google.service';
import { AirtableService } from '@services/airtable.service';

import { initializeCronJobs } from './jobs';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(
    routes: Routes[], 
    apiPrefix = '',
    public googleService:GoogleService,
    public airtableService: AirtableService,
  ) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeTrustProxy();
    this.initializeMiddlewares();
    this.initializeRoutes(routes, apiPrefix);
    this.initializeErrorHandling();

    // Now this will work
    //console.log('googleService', this.googleService);
    //this.googleService.getAllUsersFromDirectory();
    //this.googleService.syncGoogleData();
    //this.googleService.temp();
    //this.googleService.deleteDuplicateAssignments();
    //this.airtableService.getAirtableDataProductions();
  }

  public listen() {
    const server = this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);

      initializeCronJobs();

    });

    return server;
  }

  public getServer() {
    return this.app;
  }

  private initializeTrustProxy() {
    this.app.set('trust proxy', 1);
  }

  private initializeMiddlewares() {
    this.app.use(
      rateLimit({
        windowMs: 60_000,
        limit: this.env === 'production' ? 100 : 1000,
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) =>
          this.env !== 'production' ||
          ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.ip ?? ''),
      }),
    );

    this.app.use(morgan(LOG_FORMAT || 'dev', { stream }));

    // CORS
    const allowedOrigins = [
      'http://localhost:4200',
      'https://balboa-app.azurewebsites.net',
      'https://askbalboa.com'
    ];

    this.app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: CREDENTIALS,
      }),
    );

    this.app.use(hpp());
    this.app.use(
      helmet({
        contentSecurityPolicy:
          this.env === 'production'
            ? {
                directives: {
                  defaultSrc: ["'self'"],
                  scriptSrc: ["'self'", "'unsafe-inline'"],
                  objectSrc: ["'none'"],
                  upgradeInsecureRequests: [],
                },
              }
            : false, 
        referrerPolicy: { policy: 'no-referrer' },
      }),
    );
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());
    
  }

  
  private initializeRoutes(routes: Routes[], apiPrefix: string) {
  routes.forEach((route) => {
    // Combine /api + /chat to mount the router at /api/chat
    const fullPath = apiPrefix.replace(/\/+/g, '/');
    this.app.use(fullPath, route.router);
  });
}

  private initializeErrorHandling() {
    this.app.use(NotFoundMiddleware);
    this.app.use(ErrorMiddleware);
  }


  //
}

export default App;
