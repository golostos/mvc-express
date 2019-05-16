require('module-alias/register');
const express = require('express');
const app = express();
const userValidators = require('@services/validators/user-validators');
const UserController = require('@controllers/users-controller')
const { verifyToken, checkAccess } = require('@services/auth/auth-service');
const { port } = require('@config-server/config')

app.use(express.json());
app.use('/api/*', verifyToken)

app.post('/api/signup', userValidators.create, UserController.create);
app.post('/api/login', userValidators.login, UserController.login);
app.patch('/api/users/:login', userValidators.update, checkAccess('User', 'update'), UserController.update);
app.delete('/api/users/:login', userValidators.deleteUser, checkAccess('User', 'delete'), UserController.deleteUser);

app.use((err, req, res, next) => {
    console.error(err);
    const error = err.statusCode >= 500 ? 'There are some problems on the server' : err.message;
    res.status(err.statusCode).json({ error })
})

app.listen(port, () => {
    console.log(`Server started on ${port} port`);
})