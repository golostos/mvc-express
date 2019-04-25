const { body } = require('express-validator/check');

const validators = {
    userValidator: [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim()
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
        .matches(/\d/).withMessage('must contain a number')
    ],
    loginValidator: [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').not().isEmpty().trim()
        .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
        .matches(/\d/).withMessage('must contain a number')
    ]
}

module.exports = validators;