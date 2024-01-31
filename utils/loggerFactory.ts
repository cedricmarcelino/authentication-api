import { Request, Response, NextFunction } from 'express'
export const logger = require('pino')();

export const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
    const child = logger.child(req.body)
    child.info(`${req.method} request from ${req.path}`)
    next()
}