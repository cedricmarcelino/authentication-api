import { Request, Response } from 'express'
import { userLoginSchema } from '../schema/users';
import { db } from '../db';
import { IUser } from '../db/models';
import bcrypt from 'bcrypt'
import { logger } from '../utils/loggerFactory'
const userController = require('./user.controller')

const login_user = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        logger.info('Validating request body.')
        const data: IUser = await userLoginSchema.validateAsync(body)
        logger.info('Request body valid.')
        const { username, password } = data
        const user = await db.users.getUserByUsername(username)
        if (user.length > 0) {
            const validatePassword = bcrypt.compareSync(password, user[0].password)
            if(validatePassword) {
                const token = userController.createToken(user[0].username);
                res.cookie('jwt', token, { httpOnly: true, maxAge: userController.maxAge * 1000 })
                logger.info('User authentication successful.')
                return res.send('User authenticated!')
            }
            logger.error('User authentication failed. Incorrect password.')
            return res.send('Password incorrect!')
        } else {
            logger.error('Username does not exist.')
            return res.status(409).send('Username does not exist.')
        }
    } catch (error: any) {
        if(error.details) {
            logger.error('Request body invalid.')
            logger.error(error.details)
            return res.status(400).send(error.details)
        } else {
            logger.error(error)
            return res.status(500).send(error)
        }
    }
}

module.exports = {
    login_user,
}