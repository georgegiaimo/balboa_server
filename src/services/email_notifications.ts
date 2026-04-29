import { EmailNotificationsRepository, IEmailNotificationsRepository } from '@/repositories/email_notifications.repository';
import { injectable, inject, delay } from 'tsyringe';


@injectable()
export class EmailNotificationsService {

    constructor(
        @inject(EmailNotificationsRepository) private emailNotificationsRepository: IEmailNotificationsRepository,
    ) { }

    public async saveEmailNotification(object:any) {
        var response = await this.emailNotificationsRepository.saveEmailNotification(object);
        return response;
    }

}