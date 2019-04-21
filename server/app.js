const express = require('express');
const app = express();
const { body, validationResult } = require('express-validator/check');
const bodyParser = require('body-parser');
const { userValidator } = require('./services/validators');
const UserController = require('./controllers/users-controller')

app.use(express.json());

app.get('/hello', (req, res, next) => {
    //res.send('Hello');
    console.log('step 1');
    next();
}, (req, res, next) => {
    console.log('step 2')
    res.send('Hello');
});

app.post('/api/signup', userValidator, UserController.create)

app.listen(4000, () => {
    console.log('Server started on 4000 port');
})