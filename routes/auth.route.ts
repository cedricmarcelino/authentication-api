const express = require('express');
const authController = require('../controller/auth.controller');

const router = express.Router();

/**
 * @swagger
 *  tags:
 *   name: Authentication
 *   description: Endpoints related to Authentication.
 */

/**
 * @swagger
 *  /login:
 *   post:
 *    summary: Login as a specific user.
 *    tags: [Authentication]
 *    description: Returns the user's information upon logging in. The response will also provide a JWT in its Set-Cookie header for authentication purposes.
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         username:
 *          type: string
 *          description: User's username.
 *         password:
 *          type: string
 *          description: User's password.
 *        required: 
 *         username
 *         password
 *        example:
 *         username: cedricmarcelino
 *         password: SecuredPassword0711!
 *    responses:
 *     200:
 *      description: OK 
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
 *     401: 
 *      description: Unauthorized
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorWithPropSchema'
 *     404: 
 *      description: Not Found
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/ErrorWithPropSchema'
 *     500: 
 *      $ref: '#/components/responses/500'
 */

/**
 * @swagger
 *  /logout:
 *   post:
 *    summary: Logout the currently logged in user.
 *    tags: [Authentication]
 *    description: Returns a message once the user is successfuly logged out. This will clear the current JWT Cookie if there is one.
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           type: object
 *           properties:
 *            message: 
 *             type: string
 *     500: 
 *      $ref: '#/components/responses/500'
 */

router.post('/login', authController.login_user)
router.post('/logout', authController.logout_user)

module.exports = router;