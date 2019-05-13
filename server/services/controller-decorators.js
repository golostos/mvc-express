const { validationResult } = require('express-validator/check');

const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

function decorateActions(actions = {}, decorator) {
    return Object.keys(actions).reduce((result, actionName) => {
        return {
            ...result,
            [actionName]: decorator(actions[actionName])
        }
    }, {})
}

function validateDecorator(actions = {}) {
    return decorateActions(actions, (action) => (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({message: errors.array(), statusCode: 422})
        }
        return action(req, res, next);
    })
}

function errorAsyncDecorator(actions = {}) {
    return decorateActions(actions, (action) => (req, res, next) => {        
        return action(req, res, next).catch(error => {
            next(Object.assign(error, {statusCode: error.statusCode || 500}))
        })
    })
}

module.exports = {
    validateDecorator,
    errorAsyncDecorator,
    compose
}