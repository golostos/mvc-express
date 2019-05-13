require('module-alias/register');
const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
const { createUserValidator, loginValidator, updateUserValidator } = require('@services/validators');
const UserController = require('@controllers/users-controller')
const { verifyToken } = require('@services/auth-service');

app.use(express.json());
app.use('/api/*', verifyToken)

app.post('/api/signup', createUserValidator, UserController.create);
app.post('/api/login', loginValidator, UserController.login);
app.patch('/api/user/:login/update', updateUserValidator, UserController.update);

app.use((err, req, res, next) => {
    console.error(err);
    const error = err.statusCode >= 500 ? 'There are some problems on the server' : err.message;
    res.status(err.statusCode).json({ error })
})

app.listen(4000, () => {
    console.log('Server started on 4000 port');
})