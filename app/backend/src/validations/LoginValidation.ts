import * as bcrypt from 'bcryptjs';
import UserModel from '../database/models/UserModel';
import { ILogin, IUser } from '../interfaces';

export default class LoginValidation {
  static validateLoginInputs(loginData: ILogin): void {
    const { email, password } = loginData;
    if (!email || !password) throw new Error('All fields must be filled');
  }

  static async validateLoginData(loginData: ILogin): Promise<IUser> {
    const { email, password } = loginData;
    const user: IUser | null = await UserModel.findOne({ where: { email } });
    if (!user) throw new Error('Incorrect email or password');

    const validPassword: boolean = bcrypt.compareSync(password, user.password);
    if (!validPassword) throw new Error('Incorrect email or password');

    return user;
  }
}
