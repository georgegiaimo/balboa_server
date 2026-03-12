import express from 'express';
import 'reflect-metadata';
import './database.config';
import { Routes } from './interfaces/routes.interface';
declare class App {
    app: express.Application;
    env: string;
    port: string | number;
    constructor(routes: Routes[], apiPrefix?: string);
    listen(): import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
    getServer(): express.Application;
    private initializeTrustProxy;
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
}
export default App;
