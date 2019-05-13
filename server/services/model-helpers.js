const bcryptjs = require('bcryptjs');
const { promiseError } = require('@services/error-helper');
const _ = require('lodash');

async function createPasswordHash(password) {
  const salt = bcryptjs.genSaltSync(10);
  return bcryptjs.hash(password, salt);
}

async function comparePassword(password, hash) {
  return bcryptjs.compare(password, hash)
}

async function updateOwnUserData(newUserData, userFromDB) {
  newUserData = attachNewProfile(newUserData, userFromDB)
  if (newUserData.login || newUserData.email || newUserData.newPassword) {
    if (typeof newUserData.password === 'string'
      && await comparePassword(newUserData.password, userFromDB.password)) {
        newUserData = await attachNewPassword(newUserData)
    } else return promiseError("Current password required for this operation", 403);
  }
  return newUserData
}

async function updateAnyUserData(newUserData, userFromDB) {
  newUserData = attachNewProfile(newUserData, userFromDB)
  newUserData = await attachNewPassword(newUserData)
  return newUserData
}

async function attachNewPassword(newUserData) {
  newUserData = _.cloneDeep(newUserData);
  if (newUserData.newPassword) {
    newUserData.password = await createPasswordHash(newUserData.newPassword);
    delete newUserData.newPassword;
  } else delete newUserData.password;
  return newUserData;
}

function attachNewProfile(newUserData, userFromDB) {
  newUserData = _.cloneDeep(newUserData);
  if (typeof newUserData.profile === 'object') {
    newUserData.profile = { ...userFromDB.profile, ...newUserData.profile }
  }
  return newUserData;
}

module.exports = {
  createPasswordHash,
  updateOwnUserData,
  comparePassword,
  updateAnyUserData
}