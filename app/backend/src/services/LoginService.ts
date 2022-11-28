import { ILogin } from '../interfaces';
import generateJWT from '../utils/generateJWT';
import LoginValidation from '../validations/LoginValidation';

export default class LoginService {
  public static async doLogin(loginData: ILogin): Promise<string> {
    LoginValidation.validateLoginInputs(loginData);
    const user = await LoginValidation.validateLoginData(loginData);
    const token = generateJWT(user);
    return token;
  }
}
