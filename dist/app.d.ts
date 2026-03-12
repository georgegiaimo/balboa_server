import express from 'express';
import 'reflect-metadata';
import './database.config';
import { Routes } from './interfaces/routes.interface';
import { GoogleService } from './services/google.service';
import { AirtableService } from './services/airtable.service';
declare class App {
    googleService: GoogleService;
    airtableService: AirtableService;
    app: express.Application;
    env: string;
    port: string | number;
    constructor(routes: Routes[], apiPrefix: string | undefined, googleService: GoogleService, airtableService: AirtableService);
    listen(): import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    getServer(): express.Application;
    private initializeTrustProxy;
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
}
export default App;
