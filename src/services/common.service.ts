import { injectable, inject } from 'tsyringe';
import { HttpException } from '@exceptions/httpException';

@injectable()
export class CommonService {
    constructor() { }

    getDate = (epoch: number): string => {
        
        if(!epoch) return '-';
        // Heuristic: If the number is too small (e.g., 10 digits), 
        // it's likely seconds. JS Date needs milliseconds (13 digits).
        const timestamp = epoch < 10000000000 ? epoch * 1000 : epoch;

        const date = new Date(timestamp);

        // Extract components
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}-${day}-${year}`;
    };

    getDate2 = (epoch: number): string => {
        
        if(!epoch) return '-';
        // Heuristic: If the number is too small (e.g., 10 digits), 
        // it's likely seconds. JS Date needs milliseconds (13 digits).
        const timestamp = epoch < 10000000000 ? epoch * 1000 : epoch;

        const date = new Date(timestamp);

        // Extract components
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    };

    createToken = () => {
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var token = '';
        for (var i = 0; i < 16; i++) {
            token += chars.charAt(Math.round(Math.random() * (chars.length - 1)));
        }
        return token;
    }

    createPassword = () => {
        var chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
        var token = '';
        for (var i = 0; i < 8; i++) {
            token += chars.charAt(Math.round(Math.random() * (chars.length - 1)));
        }
        return token;
    }

    getTodaysDateMinusThree(): string {
        const date = new Date();

        // Subtract 5 days
        date.setDate(date.getDate() - 5);

        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    getNoonEpoch(dateString: string) {
        const date = new Date(dateString);

        // Set the time to 12:00:00.000 (Local Time)
        date.setHours(12, 0, 0, 0);

        // getTime() returns milliseconds, so we divide by 1000 to get seconds
        var epoch = date.getTime();

        if (isNaN(epoch)) return null;
        else return epoch;
    }

    getDateTime(epoch: number, locale: string = 'en-US'): string {
        // Check if epoch is in seconds (10 digits) vs milliseconds (13 digits)
        const timestamp = epoch < 1e11 ? epoch * 1000 : epoch;
        const date = new Date(timestamp);

        return new Intl.DateTimeFormat(locale, {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'America/Los_Angeles', // Forces Pacific Time (PST/PDT)
        }).format(date);
    }

}
