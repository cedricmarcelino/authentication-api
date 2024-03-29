import { db } from '../db'
import { Request, Response } from 'express'
import { userSchema } from '../schema/users'
import { IUser } from '../db/models'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { logger } from '../utils/loggerFactory'
import { responseError } from '../utils/response'

interface CustomJWTPayload extends JwtPayload {
    username: string;
}
interface CustomJwt extends Omit<Jwt, 'payload'>{
    payload: CustomJWTPayload;
}

const maxAge = 60 * 60
const sampleSecret = 'this is a sample secret'

const createToken = (username: string) => {
    return jwt.sign({ username }, sampleSecret, {
        expiresIn: maxAge
    })
}

const hashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)
    return hashedPassword;
  }

const users_index = async (req: Request, res: Response) => {
    try {
        const pageSize = req.query.pageSize as string|| '10'
        const page = req.query.page as string || '1'
        if(parseInt(page) < 1 || parseInt(pageSize) < 1 || Number.isNaN(parseInt(page)) || Number.isNaN(parseInt(pageSize))) {
            const response = responseError('Invalid query parameters.')
            return res.status(400).send(response)
        }
        const { count } = await db.users.count()
        logger.info('Retrieving all users.')
        db.users.all(parseInt(pageSize), parseInt(page)).then((data) => {
            logger.info('Retrieved all users.')
            const response = {data, page, pageSize, total: count}
            return res.send(response)
        })
    } catch (error) {
        logger.error(error)
        const response = responseError('Internal Server Error')
        return res.status(500).send(response)
    }
}

const users_add = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        logger.info('Validating request body.')
        const data: IUser = await userSchema.validateAsync(body)
        logger.info('Request body valid.')
        const { username, password, email, first_name, last_name } = data
        logger.info('Checking if username exists.')
        const isUsernameTaken = await db.users.getUserByUsername(username)
        if (isUsernameTaken.length > 0) {
            logger.error('Username is already taken.')
            const response = responseError('Username is already taken.', 'username')
            return res.status(409).send(response)
        }
        logger.info('Username is not taken.')
        logger.info('Checking if email is already in use.')
        const isEmailTaken = await db.users.getUserByEmail(email)
        if (isEmailTaken.length > 0) {
            logger.error('Email is already linked to an account.')
            const response = responseError('Email is already linked to an account.', 'email')
            return res.status(409).send(response)
        }
        logger.info('Email is not taken.')
        logger.info('Encrypting password.')
        const hashedPassword = hashPassword(password)
        logger.info('Password encrypted.')
        db.users.add(username, hashedPassword, email, first_name, last_name).then((data) => {
            logger.info('User created.')
            logger.info('Creating JWT for authentication.')
            const token = createToken(data.username)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            logger.info('JWT set and sent to client.')
            logger.info(data)
            const response = {
                data
            }
            return res.send(response)
        })
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

const users_getByUsername = async (req: Request, res: Response) => {
    try {
        logger.info('Checking for JWT.')
        const token: string = req.cookies.jwt
        if (token) {
            logger.info('Token found.')
            logger.info('Verifying authenticity of token.')
            const verify = jwt.verify(token, sampleSecret, { complete: true }) as CustomJwt
            logger.info('Token verified.')
            logger.info(`Getting requested user's data.`)
            const getUser = await db.users.getUserByUsername(req.params.username)
            if (getUser.length > 0) {
                logger.info('User found.')
                const loggedInUser = verify.payload.username
                logger.info('Verifying if logged in user is requesting for its own data.')
                if(getUser[0].username === loggedInUser) {
                    logger.info('Verified that the user is requesting for its own data.')
                    const { username, email, first_name, last_name } = getUser[0]
                    const data = { username, email, first_name, last_name }
                    logger.info('Data sent to user.')
                    logger.info(data)
                    const response = {data}
                    return res.send(response);
                }
                logger.error('Please log in as the requested user.')
                const response = responseError('Please log in as the requested user.')
                return res.status(403).send(response)
            }
            logger.error('The requested user does not exist.')
            const response = responseError('The requested user does not exist.')
            return res.status(404).send(response)
        } else {
            logger.error('User is not logged in.')
            const response = responseError('Please log in.')
            return res.status(401).send(response)
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            logger.error(`${error.name}: ${error.message}`)
            const response = responseError(`${error.name}: ${error.message}`)
            return res.status(400).send(response)
        }
        const response = responseError('Internal Server Error')
        logger.error(error)
        return res.status(500).send(response)
    }
}

module.exports = {
  users_index,
  users_add,
  maxAge,
  createToken,
  users_getByUsername,
}