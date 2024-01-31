import { db } from '../db'
import { Request, Response } from 'express'
import { userSchema } from '../schema/users'
import { IUser } from '../db/models'
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'

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

const users_index = (_req: Request, res: Response) => {
    try {
        console.log('Retrieving all users.')
        db.users.all().then((data) => {
            console.log('Retrieved users.', data)
            return res.send(data)
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

const users_add = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        console.log('Validating request body. \n', body)
        const data: IUser = await userSchema.validateAsync(body)
        console.log('Request body valid.  \n', body)
        const { username, password, email, first_name, last_name } = data
        console.log('Checking if username exists.')
        const isUsernameTaken = await db.users.getUserByUsername(username)
        if (isUsernameTaken.length > 0) {
            console.log('Username is already taken.')
            return res.status(409).send('Username is already taken.')
        }
        console.log('Username is not taken.')
        console.log('Checking if email is already in use.')
        const isEmailTaken = await db.users.getUserByEmail(email)
        if (isEmailTaken.length > 0) {
            console.log('Email is already linked to an account.')
            return res.status(409).send('Email is already linked to an account.')
        }
        console.log('Email is not taken.')
        console.log('Encrypting password')
        const hashedPassword = hashPassword(password)
        console.log('Password encrypted.')
        db.users.add(username, hashedPassword, email, first_name, last_name).then((data) => {
            const token = createToken(data.username)
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
            res.send(data)
        })
    } catch (error: any) {
        if(error.details) {
            console.log('Request body invalid.', error.details)
            return res.status(400).send(error.details)
        } else {
            return res.status(500).send(error)
        }
    }
}

const users_getByUsername = async (req: Request, res: Response) => {
    try {
        const token: string = req.cookies.jwt
        if (token) {
            const verify = jwt.verify(token, sampleSecret, { complete: true }) as CustomJwt
            const getUser = await db.users.getUserByUsername(req.params.username)
            if (getUser.length > 0) {
                const loggedInUser = verify.payload.username
                if(getUser[0].username === loggedInUser) {
                    console.log('User logged in as requested user.')
                    const { username, email, first_name, last_name } = getUser[0]
                    return res.send({ username, email, first_name, last_name });
                }
                return res.status(403).send('Please log in as the requested user.')
            }
            return res.status(404).send('The user requested does not exist.')
        } else {
            return res.status(401).send('Unauthenticated.')
        }
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).send(error)
        }
        return res.status(500).send(error)
    }
}

module.exports = {
  users_index,
  users_add,
  maxAge,
  createToken,
  users_getByUsername,
}