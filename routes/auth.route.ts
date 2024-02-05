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
 *      description: Returns the user's information upon logging in. 
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

/**
 * @swagger
 *  /logout:
 *   post:
 *    summary: Logout the currently logged in user.
 *    tags: [Authentication]
 *    responses:
 *     200:
 *      description: Returns a success message upon logging out.
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