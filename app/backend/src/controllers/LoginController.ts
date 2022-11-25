import { Request, Response } from 'express';
import { ILogin, IUser } from '../interfaces';
import { LoginService } from '../services';

export default class LoginController {
  public static doLogin = async (req: Request, res: Response) => {
    const loginData: ILogin = req.body;
    const token = await LoginService.doLogin(loginData);
    res.status(200).json({ token });
  };

  public static validateLogin = async (req: Request, res: Response) => {
    const { role } = req.body.user.data.dataValues as IUser;
    res.status(200).json({ role });
  };
}
