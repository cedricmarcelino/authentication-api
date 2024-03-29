import { Request, Response } from 'express'
import { userLoginSchema } from '../schema/users';
import { db } from '../db';
import { IUser } from '../db/models';
import bcrypt from 'bcrypt'
import { logger } from '../utils/loggerFactory'
import { responseError } from '../utils/response';
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
                const response = {
                    data: {
                        username: user[0].username,
                        email: user[0].email,
                        first_name: user[0].first_name,
                        last_name: user[0].last_name,
                    }
                }
                return res.send(response)
            }
            logger.error('User authentication failed. Incorrect password.')
            const response = responseError('Incorrect password.', 'password')
            return res.status(401).send(response)
        } else {
            logger.error('This username does not exist.')
            const response = responseError('This username does not exist.', 'username')
            return res.status(404).send(response)
        }
    } catch (error: any) {
        if(error.details) {
            logger.error('Request body invalid.')
            logger.error(error.details)
            const response = responseError(error.details[0].message, error.details[0].context?.key)
            return res.status(400).send(response)
        } else {
            logger.error(error)
            const response = responseError('Internal Server Error')
            return res.status(500).send(response)
        }
    }
}

const logout_user = async (req: Request, res: Response) => {
    try {
        res.clearCookie('jwt')
        const data = {
            message: 'User logged out successfuly.'
        }
        logger.info('User log out success.')
        res.send(data)
    } catch (error: any) {
        logger.error(error)
        const response = responseError('Internal Server Error')
        return res.status(500).send(response)
    }
}

module.exports = {
    login_user,
    logout_user
}