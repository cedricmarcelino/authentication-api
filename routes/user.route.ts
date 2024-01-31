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
 *  /users:
 *   get:
 *    summary: Returns all of the users.
 *    tags: [Users]
 *   post:
 *    summary: Register a new user.
 *    tags: [Users]
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties: 
 *         username:
 *          type: string
 *         password:
 *          type: string
 *         email:
 *          type: string
 *         first_name:
 *          type: string
 *         last_name:
 *          type: string
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
router.get('/', userController.users_index);
router.post('/', userController.users_add)
router.get('/:username', userController.users_getByUsername)

module.exports = router;