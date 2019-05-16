const jwt = require('jsonwebtoken');
const config = require('@config-server/config');
// const models = require('@models');
// const grants = require('@config-server/grants');
const checkAccess = require('./permission-service');

function createToken(userFromDB) {
  const token = jwt.sign({ id: userFromDB.id, role: userFromDB.role }, config.secret, {
    expiresIn: 86400
  })
  return token;
}

function verifyToken(req, res, next) {
  if (req.headers['authorization'] && req.headers['authorization'].length) {
    const token = req.headers['authorization'].replace(/(bearer|jwt)\s+/i, '');
    jwt.verify(token, config.secret, (err, decodedToken) => {
      if (err) {
        return next({ message: "Failed to authenticate token", statusCode: 401 });
      }
      req.credentials = { id: decodedToken.id, role: decodedToken.role };
      next();
    })
  } else {
    req.credentials = { role: 'guest' };
    next();
  }
}

// function checkAccess(resource, action) {
//   return async (req, res, next) => {
//     if (Object.keys(req.params).length) {
//       const query = { ...req.params }
//       const resourceInstance = await models[resource].findOne({ where: query });
//       if (resourceInstance) {
//         const userIdName = resource === 'User' ? 'id' : 'userId';
//         const { role, id: userId } = req.credentials;
//         const isOwn = resourceInstance[userIdName] === userId;
//         const ownPermissions = grants.can(role)[action + 'Own'](resource)
//         const anyPermissions = grants.can(role)[action + 'Any'](resource)
//         if (isOwn && ownPermissions.granted) {
//           req.resourceData = { isOwn, resourceInstance };
//           req.body = ownPermissions.filter(req.body);
//           next();
//         } else if(anyPermissions.granted) {
//           req.resourceData = { isAny: true, resourceInstance };
//           req.body = anyPermissions.filter(req.body);
//           next();
//         } else return next({message: "You don't have enough permissions for this", statusCode: 403});
//       } else return next({message: "Can't find this " + resource, statusCode: 422});
//     } else next();
//   }
// }

module.exports = {
  createToken,
  verifyToken,
  checkAccess
}