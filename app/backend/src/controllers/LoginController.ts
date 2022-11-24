import { Request, Response } from 'express';
import { ILogin } from '../interfaces';
import LoginService from '../services';

export default class LoginController {
  public static async doLogin(req: Request, res: Response) {
    const loginData: ILogin = req.body;
    const token = await LoginService.doLogin(loginData);
    res.status(200).json({ token });
  }
}
