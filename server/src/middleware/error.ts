import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Middleware that handles requests to unknown routes.
 * Sends a 404 JSON response with a standardized error shape.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {void}
 */
function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    data: null,
    error: { message: `Route ${req.method} ${req.path} not found` },
  });
}

/**
 * Error-handling middleware.
 * Logs the error to the console and sends a JSON response with an appropriate
 * status code and message.
 *
 * @param {Error & { statusCode: number }} err - Error object, optionally with a `statusCode`.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void}
 */
function errorHandler(
  err: Error & { statusCode: number },
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(err.message, { stack: err.stack });

  const statusCode = err.statusCode ?? 500;
  const message =
    statusCode === 500 ? 'An error has occurred on the server' : err.message;

  res.status(statusCode).json({
    success: false,
    data: null,
    error: { message },
  });

  next();
}

export { notFoundHandler, errorHandler };
