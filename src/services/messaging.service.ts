import { injectable, inject, delay } from 'tsyringe';
import { CommonService } from './common.service';
import { ApisRepository, IApisRepository } from '@/repositories/apis.repository';
import { SendGridService } from './sendgrid.service';


@injectable()
export class MessagingService {

    constructor(
        @inject(ApisRepository) private apisRepository: IApisRepository,
        @inject(SendGridService) private sendgridService: SendGridService
    ) { }

    public async sendMessage(message: any) {

        console.log('send message here', message);

        var all_users = await this.apisRepository.getUsers();
        var recipients_ids = JSON.parse(message.recipients_ids);
        var users = all_users.filter((x: any) => { return recipients_ids.indexOf(x.user_id) > -1 });

        console.log('users', users);

        var composed_message_object:any = {
            subject: message.subject,
            message_html: message.message,
            recipients_ids: message.recipients_ids,
            admin_name: message.admin_name,
            admin_email: message.admin_email,
            admin_id: message.admin_id,
            created_timestamp: Date.now()
        }

        var composed_message_id = await this.apisRepository.addComposedMessage(composed_message_object);

        //var ctr = 1;
        for (let recipient of users) {

            var object: any = {
                composed_message_id: composed_message_id,
                recipient_email: recipient.production_email,
                user_id: recipient.user_id
            }

            //console.log('message ', ctr);
            //await this.sendgridService.sendComposedMessage(object);

            //if (ctr == 1) {
                //composed_message_object.recipient_email = 'amoctezuma81@gmail.com';
                //console.log('****', composed_message_object);

                var sendgrid_response = await this.sendgridService.sendComposedMessage(composed_message_object);
                var sendgrid_message_id = sendgrid_response.response[0].headers['x-message-id'];

                object.sendgrid_message_id = sendgrid_message_id;


                //record sending of message, use email as identifier
                await this.apisRepository.addIndividualMessage(object);

            //}

            //ctr += 1;
        }


    }

}
