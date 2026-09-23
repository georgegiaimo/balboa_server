import { injectable, inject } from 'tsyringe';
import { HttpException } from '@exceptions/httpException';
import { SystemRepository, type ISystemRepository } from '@repositories/system.repository';
import twilio from 'twilio';

@injectable()
export class SystemService {
  constructor(@inject(SystemRepository) private systemRepository: ISystemRepository) {}

  async getConfiguration(): Promise<any[]> {
    return this.systemRepository.getConfiguration();
  }

  async updateConfiguration(data: any): Promise<any> {
    const result = await this.systemRepository.updateConfiguration(data);
    if (!result) throw new HttpException(404, 'User not found');
    return result;
  }

  async sendCode2FA(data: any): Promise<any> {

    try{

      const accountSid = process.env.TWILIO_ACCOUNT_SID!;
      const authToken = process.env.TWILIO_AUTH_TOKEN!;
      const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

      if (!accountSid || !authToken || !verifyServiceSid) {
        throw new Error('Missing Twilio credentials in environment variables.');
      }

      const twilioClient = twilio(accountSid, authToken);

      var phoneNumber = data.phone_number;
    

    // Call Twilio Verify API to create a verification code
    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms', // Can be 'sms', 'call', or 'whatsapp'
      });

    return {
      success: true,
      status: verification.status, // e.g., 'pending'
      message: 'Verification code sent successfully.',
    };
    }
    catch(err){
      return {
        success: false,
        message: err
      }
    }
  }

  async verifyCode2FA(data: any): Promise<any> {
    try{

      const accountSid = process.env.TWILIO_ACCOUNT_SID!;
      const authToken = process.env.TWILIO_AUTH_TOKEN!;
      const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID!;

      if (!accountSid || !authToken || !verifyServiceSid) {
        throw new Error('Missing Twilio credentials in environment variables.');
      }

      const twilioClient = twilio(accountSid, authToken);

      var phoneNumber = data.phone_number;
      // Check code against Twilio Verify API
    const verificationCheck = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: data.code,
      });

    if (verificationCheck.status === 'approved') {
      // Code is valid! Update user record in database here
      // e.g., await User.update({ is2faVerified: true }, { where: { phone: phoneNumber } });

      return {
        success: true,
        status: verificationCheck.status,
        message: 'Two-factor authentication verified successfully!',
      };
    } else {
      return {
        success: false,
        status: verificationCheck.status,
        message: 'Invalid or expired verification code.',
      };
    }
    }
    catch (err){
      return {
        success: false,
        status: 'error',
        message: err,
      };
    }
  }

}
