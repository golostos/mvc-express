'use strict';
const { Model } = require('sequelize');
const Op = require('sequelize').Op;
const bcryptjs = require('bcryptjs');
const { createPasswordHash, updateOwnUserData,
  updateAnyUserData, comparePassword } = require('@services/helpers/user-model-helpers');
const { promiseError } = require('@services/helpers/error-helper');
const { profileSchema: { properties: profileSchema } } = require('@config-server/config');

class User extends Model {
  static async createUser({ login, email, password }) {
    const existUser = await User.findOne({ where: { [Op.or]: [{ email }, { login }] } })
    if (existUser) {
      return promiseError("This email or login is already used", 422);
    } else {
      const newUser = await User.create({
        login, email,
        password: await createPasswordHash(password),
        role: 'user',
        profile: Object.keys(profileSchema).reduce((profile, prop) => {
          return profileSchema[prop].type === 'string' ? ({ ...profile, [prop]: '' }) : profile
        }, {})
      });
      return newUser.get({ plain: true });
    }
  }

  static async login({ loginQuery, password }) {
    if (!loginQuery) {
      return promiseError("Neither login nor email are presented in the request", 403);
    }
    const userFromDB = await User.findOne({ where: loginQuery });
    if (userFromDB) {
      if (await comparePassword(password, userFromDB.password)) {
        return userFromDB.get({ plain: true });
      } else return promiseError("Wrong password", 403);
    } else return promiseError("Please sign up", 403);
  }

  static async updateUser({ resourceData, newUserData }) {
    let updatedUserData;
    const userFromDB = resourceData.resourceInstance;
    if (resourceData.isOwn) {
      updatedUserData = await updateOwnUserData(newUserData, userFromDB);
    } else if (resourceData.isAny) {
      updatedUserData = await updateAnyUserData(newUserData, userFromDB);
    }
    return userFromDB.update(updatedUserData)
      .then(userFromDB => userFromDB.get({ plain: true }))
      .catch(err => promiseError(err.original, 422))
  }

  static async deleteUser({ resourceData, userData: { password } }) {
    const userFromDB = resourceData.resourceInstance;
    if (resourceData.isOwn) {
      if (!(await comparePassword(password, userFromDB.password)))
        return promiseError("Current password required for this operation", 403)
    } else if (!resourceData.isAny)
      return promiseError("You don't have enough permissions for this", 403);
    return userFromDB.destroy();
  }

  static associate(models) {
    console.log('Models: ', models)
    this.hasMany(models.Sample, { foreignKey: 'userId' });
  }
}

module.exports = (sequelize, DataTypes) => {
  User.init({
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    profile: DataTypes.JSON
  }, { sequelize, modelName: 'User' })
  // sequelize.sync({alter: true})
  return User;
};