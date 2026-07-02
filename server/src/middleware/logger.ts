import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware that logs basic request information.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next middleware function.
 */
function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`${req.method} - ${req.path}`);
  next();
}

export { logger };
