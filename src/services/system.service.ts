import { injectable, inject } from 'tsyringe';
import { HttpException } from '@exceptions/httpException';
import { SystemRepository, type ISystemRepository } from '@repositories/system.repository';

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

}
