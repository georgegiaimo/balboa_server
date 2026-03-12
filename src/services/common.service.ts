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

}
