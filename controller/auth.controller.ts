import { Request, Response } from 'express'
import { userLoginSchema } from '../schema/users';
import { db } from '../db';
import { IUser } from '../db/models';
import bcrypt from 'bcrypt'
const userController = require('./user.controller')
// DONE:
// Already able to login by validating hashed password with the sent password.
// TO DO:
// Checking on which user is logged in

const login_user = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        console.log('Validating request body. \n', body)
        const data: IUser = await userLoginSchema.validateAsync(body)
        console.log('Request body valid.  \n', body)
        const { username, password } = data
        const user = await db.users.getUserByUsername(username)
        if (user.length > 0) {
            const validatePassword = bcrypt.compareSync(password, user[0].password)
            if(validatePassword) {
                const token = userController.createToken(user[0].username);
                res.cookie('jwt', token, { httpOnly: true, maxAge: userController.maxAge * 1000 })
                return res.send('User authenticated!')
            }
            return res.send('Password incorrect!')
        } else {
            console.log('Username does not exist.')
            return res.status(409).send('Username does not exist.')
        }
    } catch (error: any) {
        if(error.details) {
            console.log('Request body invalid.', error.details)
            return res.status(400).send(error.details)
        } else {
            return res.status(500).send(error)
        }
    }
}

module.exports = {
    login_user,
}