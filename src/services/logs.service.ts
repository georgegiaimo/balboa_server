import { injectable, inject, delay } from 'tsyringe';
import { CommonService } from './common.service';
import { ILogsRepository, LogsRepository } from '@/repositories/logs.repository';


@injectable()
export class LogsService {

    constructor(
        @inject(LogsRepository) private logsRepository: ILogsRepository,
        @inject(CommonService) private commonService: CommonService
    ) { }

    public async getLogs() {
        //get user logs
        var user_logs = await this.logsRepository.getUserLogs();
        
        user_logs.forEach((x:any) => {
            x.date_time = this.commonService.getDateTime(x.timestamp);
        })

        return user_logs.map((x:any) => { return {
            name: x.first_name + ' ' + x.last_name,
            action: x.action,
            date_time: x.date_time,
            user_log_id: x.user_log_id
        }});
       
    }

    public async writeToLogs(object:any) {
        var user_log_id = await this.logsRepository.writeToLogs(object);
        return user_log_id;
    }

   
}
