export declare class HttpException extends Error {
    status: number;
    message: string;
    data?: unknown;
    constructor(status: number, message: string, data?: unknown);
}
