import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';
import { ENVIRONMENT, SECRET_KEY } from '@config/env';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User, type UserCreateData } from '@entities/user.entity';
import { UsersRepository } from '@repositories/users.repository';
import type { IUsersRepository } from '@repositories/users.repository';
import bcrypt from 'bcrypt';
import { SendGridService } from './sendgrid.service';
import { CommonService } from './common.service';
import { ApisRepository, IApisRepository } from '@/repositories/apis.repository';

@injectable()
export class AuthService {
  constructor(
    @inject(UsersRepository) private usersRepository: IUsersRepository,
    @inject(SendGridService) public sendgridService: SendGridService,
    @inject(CommonService) public commonService: CommonService,
    @inject(ApisRepository) private apisRepository: IApisRepository,
  ) { }

  private createToken(user: any): TokenData {

    if (!SECRET_KEY) throw new Error('SECRET_KEY is not defined');

    if (user.admin_id === undefined) {
      throw new Error('Admin id is undefined');
    }

    const dataStoredInToken: DataStoredInToken = { user_id: user.user_id };
    const expiresIn = 60 * 60; // 1h
    const token = sign(dataStoredInToken, SECRET_KEY as string, { expiresIn });
    return { expiresIn, token };
  }

  private createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn
      }; Path=/; SameSite=Lax;${ENVIRONMENT === 'production' ? ' Secure;' : ''}`;
  }

  public async signup(user_data: any): Promise<User> {

    var userx = await this.usersRepository.findByEmail(user_data.email) as any;
    var user = userx[0];

    if (user) throw new HttpException(409, `Email is already in use`);

    var token = this.commonService.createToken();
    var hashed_password = await this.hashPassword(user_data.password);

    var user_object = {
      first_name: user_data.first_name,
      last_name: user_data.last_name,
      email: user_data.email,
      role: user_data.role,
      created_timestamp: Date.now(),
      password: hashed_password,
      status: user_data.status,
      password_reset_token: token,
      password_reset_token_expiration: Date.now() + (1000 * 60 * 60 * 24 * 3),
      production_id: user_data.production_id
    }

    var response = await this.usersRepository.save(user_object);

    //create executive-admin assignments
    if (user_data.role == 'executive-admin'){
      var productions = await this.apisRepository.getProductions();
        for (let productionx of user_data.productions){
          //find production
          var recordx = productions.find((x:any) => { return x.name == productionx});
          if (recordx){

            var assignment_object = {
              admin_id: response.insertId,
              production_id: recordx.production_id
            }

            await this.apisRepository.addExecutiveAdminProductionAssignment(assignment_object);

          }
        }
    }


    //send notification email
    var user_objectx = JSON.parse(JSON.stringify(user_object));
    user_objectx.production = user_data.production;
    user_objectx.productions = user_data.productions;
    await this.sendgridService.notificationOfAdminInvitation(user_objectx);

    return response;
  }

  public async login(loginData: {
    email: string;
    password: string;
  }): Promise<{ cookie: string; user: User }> {

    var userx = await this.usersRepository.findByEmail(loginData.email) as any;
    var user = userx[0];

    if (!user) throw new HttpException(401, `Invalid email or password.`);

    const isPasswordMatching = await this.comparePassword(loginData.password, user.password);

    if (!isPasswordMatching) throw new HttpException(401, 'Password is incorrect');

    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);

    //update user last login
    var object = {
      admin_id: user.admin_id,
      last_login: Date.now(),
      status: 'active'
    };

    await this.usersRepository.updateUser(object);

    //if user is executive admin, get assigned productions
    if (user.role == 'executive-admin'){
      var assignments = await this.apisRepository.getExecutiveAdminProductionAssignments(user.admin_id);
      user.assignments = assignments;
    }

    return { cookie, user: user };
  }

  public async logout(user: any): Promise<void> {
    console.log(`User with email ${user.email} logged out.`);

    return;
  }

  public async comparePassword(password: string, hash: string) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Error comparing password:', error);
      return false;
    }
  };

  public async hashPassword(password: string, saltRounds: number = 10) {
  try {
    // Generate a salt and hash the password in one step
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Encryption failed');
  }
};

public async getAdminFromToken(token:string){

  console.log('token = ', token);

  var userx = await this.usersRepository.findByToken(token);
  var user = userx[0];

  console.log('userx', userx);

  return user;

}

public async resetPassword(data:any){

  console.log('reset password', data);
  
  //save hashed password
  var password_hashed = await this.hashPassword(data.password);
  
  var object = {
    admin_id: data.admin_id,
    password: password_hashed
  }

  var response = await this.usersRepository.updateUser(object);
  return response;

}

public async sendResetLink(data:any){
  var email = data.email;
  var userx = await this.usersRepository.findByEmail(email) as any;
  var user = userx[0];

  if(user){

    var token = this.commonService.createToken();
    var expiration_date = Date.now() + (1000 * 60 * 60 * 24 * 3);

    //update user
    var user_object = {
      admin_id: user.admin_id,
      email: user.email,
      password_reset_token: token,
      password_reset_token_expiration: expiration_date
    }

    await this.usersRepository.updateUser(user_object);
    await this.sendgridService.resetPassword(user_object);

    return true;
  }
  
}

}
