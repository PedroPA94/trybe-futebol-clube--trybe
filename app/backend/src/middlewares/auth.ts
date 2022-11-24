import 'dotenv';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default async function auth(req: Request, res: Response, next: NextFunction) {
  const token: string | undefined = req.headers.authorization;
  const secret = process.env.JWT_SECRET as string;

  if (!token) {
    const e = new Error('Token not found');
    throw e;
  }

  try {
    const decode = jwt.verify(token, secret);
    req.body.user = decode;
    next();
  } catch (err) {
    const e = new Error('Token must be a valid token');
    throw e;
  }
}
