const { User } = require('@models')
const { validateDecorator, errorAsyncDecorator, compose } = require('@services/controller-decorators');
const { createToken } = require('@services/auth/auth-service');
const grants = require('@config-server/grants');
const _ = require('lodash');

// MVC => controller => actions
async function create(req, res, next) {
  const newUser = await User.createUser(req.body)
  res.json({
    success: true,
    login: newUser.login,
    email: newUser.email,
    token: createToken(newUser)
  });
}

async function login(req, res, next) {
  const loginUser = req.body;
  const user = await User.login(loginUser)
  const token = createToken(user)
  res.json({ token });
}

async function update(req, res, next) {  
  const updatedUser = await User.updateUser({
    newUserData: req.body,
    resourceData: req.resourceData
  })
  res.json({
    success: true,
    updatedUserData: _.pickBy(updatedUser, (value, key) => {
      return ['login', 'email', 'role', 'profile'].includes(key)
    })
  })
}

async function deleteUser(req, res, next) {
  await User.deleteUser({
    userData: req.body,
    resourceData: req.resourceData
  })
  res.json({
    success: true,
    removedUser: req.params.login
  })
}

module.exports = compose(validateDecorator, errorAsyncDecorator)({
  create,
  login,
  update,
  deleteUser
})