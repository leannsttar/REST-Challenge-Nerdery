import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {

  if (err instanceof HttpError) {
    res.status(err.status).json({
      message: err.message,
      name: err.name,
      details: (err as any).details || undefined 
    });
    return; 
  }

  if (err instanceof Error) {
    res.status(500).json({
      message: err.message,
      name: err.name
    });
    return;
  }

  res.status(500).json({
    message: 'Internal server error',
    name: 'UnknownError'
  });
}