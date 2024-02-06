const express = require('express');
const userController = require('../controller/user.controller');

const router = express.Router();

/**
 * @swagger
 *  tags:
 *   name: Users
 *   description: Endpoints related to Users.
 */

/**
 * @swagger
 *  components:
 *   securitySchemes:
 *    JWT:
 *     type: apiKey
 *     in: cookie
 *     name: jwt
 *   schemas:
 *    GenericErrorSchema:
 *     type: object
 *     properties:
 *      error:
 *       type: object
 *       properties:
 *        message:
 *         type: string
 *    ErrorWithPropSchema:
 *     type: object
 *     properties:
 *      error:
 *       type: object
 *       properties:
 *        property:
 *         type: string
 *        message:
 *         type: string
 *    UserNoPwSchema:
 *     type: object
 *     properties:
 *      username:
 *       type: string
 *      email:
 *       type: string
 *      first_name:
 *       type: string
 *      last_name:
 *       type: string
 *    UserSchema:
 *     type: object
 *     properties:
 *      id:
 *       type: string
 *      username:
 *       type: string
 *      password:
 *       type: string
 *      email:
 *       type: string
 *      first_name:
 *       type: string
 *      last_name:
 *       type: string
 *   responses:
 *    500:
 *     description: Internal Server Error
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         error:
 *          type: object
 *          properties: 
 *           message:
 *            type: string
 */

/**
 * @swagger
 *  /users:
 *   get:
 *    summary: Returns all of the users.
 *    tags: [Users]
 *    parameters:
 *      - in: query
 *        name: page
 *        required: false
 *        schema:
 *         type: string
 *        description: Page number to query.
 *      - in: query
 *        name: pageSize
 *        required: false
 *        schema:
 *         type: string
 *        description: Page size for the query.
 *    responses:
 *     200:
 *      description: A list of all the registered users. The response will include the password of each user. This is just to showcase that hashing and salting is implemented on the passwords before storing it in the database.
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           type: array
 *           items:
 *            $ref: '#/components/schemas/UserSchema'
 *           description: An array of all the registered users.
 *          page:
 *           type: string
 *           description: The page requested.
 *          pageSize:
 *           type: string
 *           description: The maximum number of users per page.
 *          total:
 *           type: string
 *           description: Total number of users currently registered.
 *     400: 
 *      description: Bad Request
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/GenericErrorSchema'
 *     500: 
 *      $ref: '#/components/responses/500'
 *   post:
 *    summary: Register a new user.
 *    tags: [Users]
 *    responses:
 *     200:
 *      description: Returns the data of the registered user. A JWT is returned in a cookie named JWT. This will be used for authentication when using the endpoint /users/{username}.
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/schemas/UserNoPwSchema'
 *     400: 
 *      description: Bad Request
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorWithPropSchema'
 *     409: 
 *      description: Conflict
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorWithPropSchema'
 *     500: 
 *      $ref: '#/components/responses/500'
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties: 
 *         username:
 *          type: string
 *          description: An alphanumeric string that is between 3-15 characters long.
 *         password:
 *          type: string
 *          description: A string that is between 8-32 characters long. With atleast one uppercase english letter, atleast one digit number, and atleast one special character.
 *         email:
 *          type: string
 *          description: A string that should be a valid email address.
 *         first_name:
 *          type: string
 *          description: A string with a maximum of 50 characters.
 *         last_name:
 *          type: string
 *          description: A string with a maximum of 50 characters.
 *        required: 
 *         username
 *         password
 *         email
 *         first_name
 *         last_name
 *        example:
 *         username: cedricmarcelino
 *         password: SecuredPassword0711!
 *         email: cedric@email.com
 *         first_name: Cedric
 *         last_name: Marcelino
 *  
 */

/**
 * @swagger
 *  /users/{username}:
 *   get:
 *    summary: Gets user's data by username.
 *    description: Returns the data of the user based on the username parameter. This is protected by an authentication, you'll need to be logged in as the requested user.
 *    tags: [Users]
 *    security:
 *      - JWT: []
 *    parameters:
 *      - in: path
 *        name: username
 *        required: true
 *        schema:
 *         type: string
 *        description: The user's username
 *    responses:
 *     200:
 *      description: Returns the data of the user requested.
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/schemas/UserNoPwSchema'
 *     400: 
 *      description: Bad Request
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/GenericErrorSchema'
 *     401: 
 *      description: Unauthorized
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/GenericErrorSchema'
 *     403: 
 *      description: Forbidden
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/GenericErrorSchema'
 *     404: 
 *      description: Not Found
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/GenericErrorSchema'
 *     500: 
 *      $ref: '#/components/responses/500'
 */

router.get('/', userController.users_index);
router.post('/', userController.users_add)
router.get('/:username', userController.users_getByUsername)

module.exports = router;