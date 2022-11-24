import 'dotenv';
import * as jwt from 'jsonwebtoken';
import { IUser } from '../interfaces';

export default function generateJWT(user: IUser): string {
  const { password, ...rest } = user;
  const secret = process.env.JWT_SECRET as jwt.Secret;
  const jwtConfig: jwt.SignOptions = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };
  const token = jwt.sign({ data: { ...rest } }, secret, jwtConfig);
  return token;
}
