import type { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { RequestWithUser } from '@interfaces/auth.interface';
import { type UserCreateData } from '@entities/user.entity';
import { AuthService } from '@services/auth.service';
import { asyncHandler } from '@utils/asyncHandler';
import { NextFunction } from 'express-serve-static-core';

@injectable()
export class AuthController {
  constructor(@inject(AuthService) private readonly authService: AuthService) {}

  public signUp = asyncHandler(async (req: Request, res: Response) => {
    const userData: any = req.body;
    const signUpUserData = await this.authService.signup(userData);

    res.status(201).json({ data: signUpUserData, message: 'signup' });
  });

  public logIn = asyncHandler(async (req: Request, res: Response) => {
    const loginData: { email: string; password: string } = req.body;
    const { cookie, user } = await this.authService.login(loginData);

    res.setHeader('Set-Cookie', [cookie]);
    res.status(200).json({ data: user, message: 'login' });
  });

  public getAdminFromToken = async (req: Request, res: Response, next: NextFunction) => {
     try {

            var token = req.query.token as string;         

            // Controller calls the service
            const result = await this.authService.getAdminFromToken(token);

            // Controller sends the final response
            if (result) res.status(200).json({ data: result, message: 'success' });
            else res.status(200).json({ data: result,error: 'token is invalid or expired' });
        } catch (error) {
            next(error); // Pass to global error handler
        }
  }

  public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
     try {

            var user_data = req.body;         

            // Controller calls the service
            const result = await this.authService.resetPassword(user_data);

            // Controller sends the final response
            if (result) res.status(200).json({ data: result, message: 'success' });
           
        } catch (error) {
            next(error); // Pass to global error handler
        }
  }

  public sendResetLink = async (req: Request, res: Response, next: NextFunction) => {
     try {

            var user_data = req.body;         

            // Controller calls the service
            const result = await this.authService.sendResetLink(user_data);

            // Controller sends the final response
            if (result) res.status(200).json({ data: result, message: 'success' });
           
        } catch (error) {
            next(error); // Pass to global error handler
        }
  }

 

  public logOut = asyncHandler(async (req: Request, res: Response) => {
    const userReq = req as RequestWithUser;
    const user = userReq.user;
    await this.authService.logout(user);

    res.clearCookie('Authorization', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      // secure: true, // 프로덕션에서 HTTPS일 때만
    });
    res.status(200).json({ message: 'logout' });
  });
}
