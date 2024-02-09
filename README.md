## Introduction

This is an authentication REST API and this is the first REST API I've made with NodeJS/Express deployed as a docker image in AWS EC2.

## Functionalities

1. Registering or adding a user.
2. Logging in as a user.
3. Retrieving a user's information. 
4. When retrieving a user's information, you should be logged in as the user being requested.
5. The GET /users API Endpoint exposes all of the users, regardless of authentication, this is just to show how the data for each user is being stored within the database. This is to showcase as well that the passwords are being hashed and salted before reaching the database.
6. Validation of request body.
7. Storing of data into a PostgreSQL Database
8. Swagger UI for documentation and trial purposes.

## Techs use

1. NodeJS
2. Typescript
3. Jsonwebtoken
4. Bcrypt
5. Cookie Parser
6. Joi
7. PG Promise
8. AWS ECR for hosting application's image
9. AWS EC2 for deployment
10. Swagger
11. Express JS
12. Pino HTTP
13. Docker

## Deployment

You can access the deployed Swagger UI here:
http://ec2-44-223-69-226.compute-1.amazonaws.com/explorer/
