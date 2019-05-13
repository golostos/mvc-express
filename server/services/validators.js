const { body } = require('express-validator/check');
const validator = require('validator');
const Ajv = require('ajv');
const ajv = new Ajv({ removeAdditional: true });
const { profileSchema } = require('@config-server/config');
const validateProfile = ajv.compile(profileSchema);

const bodyFilter = (validator = [], ...allowedParams) => {
  const filter = (req, res, next) => {
    req.body = allowedParams.reduce((newBody, param) => {
        return req.body[param] ? ({ ...newBody, [param]: req.body[param] }) : newBody
      } , {});
    next();
  }
  return [filter, ...validator];
}

const passwordValidationChain = (passwordFieldName) =>
  body(passwordFieldName).isString().withMessage('must be a string').trim()
    .isLength({ min: 5, max: 128 }).withMessage('must be at least 5 chars long')
    .matches(/\d/).withMessage('must contain a number')
    .matches(/[a-zA-Z]/).withMessage('must contain a letter');

const createUserValidator = [
  body('login').isString().withMessage('must be a string').trim()
    .isLength({ min: 3, max: 128 }).withMessage('must be at least 3 chars long')
    .matches(/^[a-zA-Z]\w+$/).withMessage('must start from english letter and then can contain any english letters and numbers')
    .customSanitizer(login => login.toLocaleLowerCase()),
  passwordValidationChain('password'),
  body('email').isString().withMessage('must be a string').trim()
    .isLength({ max: 128 }).isEmail().normalizeEmail()
]

const loginValidator = [
  body('loginOrEmail').isString().trim().custom((loginOrEmail, { req }) => {
    delete req.body.loginOrEmail;
    if (loginOrEmail.length > 127) throw new Error('Incorrect user email or login');
    if (validator.isEmail(loginOrEmail)) {
      req.body.loginQuery = { email: validator.normalizeEmail(loginOrEmail) }
    } else if (loginOrEmail.length > 2) {
      req.body.loginQuery = { login: loginOrEmail.toLocaleLowerCase() }
    } else throw new Error('Incorrect user email or login');
    return true;
  }),
  passwordValidationChain('password'),
]

const updateUserValidator = [
  ...createUserValidator.map(validator => validator.optional()),
  body('role').isString().trim().isIn(['admin', 'user', 'guest'])
    .withMessage('must be a correct role').optional(),
  body('profile').optional().custom((profile, { req }) => {
    if (validateProfile(profile)) {
      return true;
    } else throw new Error('Incorrect user profile');
  }),
  passwordValidationChain('newPassword').optional(),
]

module.exports = {
  createUserValidator: bodyFilter(createUserValidator, 'login', 'password', 'email'),
  loginValidator: bodyFilter(loginValidator, 'loginOrEmail', 'password'),
  updateUserValidator: bodyFilter(updateUserValidator, 'login', 'password', 'email',
    'role', 'profile', 'newPassword'),
};