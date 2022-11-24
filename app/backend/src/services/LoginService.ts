import * as bcrypt from 'bcryptjs';
import UserModel from '../database/models/UserModel';
import { ILogin, IUser } from '../interfaces';
import generateJWT from '../utils/generateJWT';

export default class LoginService {
  private static async validateLoginData(loginData: ILogin): Promise<IUser> {
    const { email, password } = loginData;
    if (!email || !password) throw new Error('All fields must be filled');

    const user = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error('Incorrect email or password');

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error('Incorrect email or password');

    return user;
  }

  public static async doLogin(loginData: ILogin): Promise<string> {
    const user = await LoginService.validateLoginData(loginData);
    const token = generateJWT(user);
    return token;
  }
}
