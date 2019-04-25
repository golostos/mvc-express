const jwt = require('jsonwebtoken');
const config = require('../config/config');

function createToken(userFromDB) {
    const token = jwt.sign({ id: userFromDB.dataValues.id }, config.secret, {
        expiresIn: 86400
    })
    return token;
}

function verifyToken(req, res, next) {
    let token;
    if (req.headers['autorization']) token = req.headers['autorization'];
    if (token) {
        token = token.replace(/bearer|jwt\s+/i, '');
        jwt.verify(token, config.secret, (err, decodedToken) => {
            if (err) {
                res.status(401).json({error: "Failed to authenticate token"})
                return;
            }
            req.userId = decodedToken.id;
            next();
        })
    } else {
        res.status(401).json({error: "No token provided"})
    }
}

module.exports = {
    createToken,
    verifyToken
}