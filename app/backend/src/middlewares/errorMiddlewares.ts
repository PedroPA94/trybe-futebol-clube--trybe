import { ErrorRequestHandler } from 'express';

const errorMessagesAndStatus = [
  {
    message: 'All fields must be filled',
    status: 400,
  },
  {
    message: 'Incorrect email or password',
    status: 401,
  },
  {
    message: 'Token not found',
    status: 401,
  },
  {
    message: 'Token must be a valid token',
    status: 401,
  },
];

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const { message } = err;
  const code = errorMessagesAndStatus.find((e) => e.message === message)?.status || 500;
  res.status(code).json({ message });
};

export default errorMiddleware;
