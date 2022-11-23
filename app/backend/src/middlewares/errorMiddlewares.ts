import { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const { message } = err;
  const code = 500;
  res.status(code).json({ message });
};

export default errorMiddleware;
