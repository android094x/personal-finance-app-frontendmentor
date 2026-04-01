import env from "env";
import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  const isOperational = err instanceof AppError;

  if (!isOperational) {
    console.error(err.stack);
  }

  const status = isOperational ? err.status : 500;
  const message = isOperational ? err.message : "Internal Server Error";

  res.status(status).json({
    error: message,
    ...(env.APP_STAGE === "dev" &&
      !isOperational && {
        stack: err.stack,
        details: err.message,
      }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, `Not found - ${req.originalUrl}`));
};
