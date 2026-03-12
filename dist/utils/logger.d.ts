import pino from 'pino';
export declare const logger: pino.Logger<never, boolean>;
export declare const stream: {
    write: (msg: string) => void;
};
