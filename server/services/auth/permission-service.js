const models = require('@models');
const grants = require('@config-server/grants');

function checkAccess(resource, action) {
  return (req, res, next) => {
    if (Object.keys(req.params).length) {
      checkPermissionToInstance(req, next, resource, action)
    } else {
      checkPermissionToResource(req, next, resource, action)
    }
  }
}

function checkPermissionToResource(req, next, resource, action) {
  const { role } = req.credentials;
  const ownPermissions = grants.can(role)[action + 'Own'](resource)
  const anyPermissions = grants.can(role)[action + 'Any'](resource)
  if (ownPermissions.granted) {
    req.resourceData = { isOwn: true };
    req.body = ownPermissions.filter(req.body);
    next();
  } else if (anyPermissions.granted) {
    req.resourceData = { 
      isAny: true,
      isUpdateAny: grants.can(role).updateAny(resource).granted
    };
    req.body = anyPermissions.filter(req.body);
    next();
  } else return next({ message: "You don't have enough permissions for this", statusCode: 403 });
}

async function checkPermissionToInstance(req, next, resource, action) {
  const query = { ...req.params }
  const resourceInstance = await models[resource].findOne({ where: query });
  if (resourceInstance) {
    const userIdName = resource === 'User' ? 'id' : 'userId';
    const { role, id: userId } = req.credentials;
    const isOwn = resourceInstance[userIdName] === userId;
    const ownPermissions = grants.can(role)[action + 'Own'](resource)
    const anyPermissions = grants.can(role)[action + 'Any'](resource)
    if (isOwn && ownPermissions.granted) {
      req.resourceData = { isOwn, resourceInstance };
      req.body = ownPermissions.filter(req.body);
      next();
    } else if (checkAnyPermissions(anyPermissions.granted, resourceInstance.isPrivate,
      role, resource)) {
      req.resourceData = { isAny: true, resourceInstance };
      req.body = anyPermissions.filter(req.body);
      next();
    } else return next({ message: "You don't have enough permissions for this", statusCode: 403 });
  } else return next({ message: "Can't find this " + resource, statusCode: 422 });
}

function checkAnyPermissions(anyGranted, isPrivate, role, resource) {
  if (anyGranted) {
    if (isPrivate) {
      if (grants.can(role).updateAny(resource).granted) return true
      else return false
    } else return true
  } else return false
}

module.exports = checkAccess;