const { validationResult } = require('express-validator/check');

module.exports = function validateDecorator(actions = {}) {
    return Object.keys(actions).reduce((result, actionName) => {
        return {
            ...result,
            [actionName]: function (req, res, next) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(422).json({errors: errors.array()})
                }
                actions[actionName](req, res, next);
            }
        }
    }, {})
}