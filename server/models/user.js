'use strict';
const { Model } = require('sequelize');
const Op = require('sequelize').Op;
const bcryptjs = require('bcryptjs');
const { createPasswordHash, updateOwnUserData,
  updateAnyUserData, comparePassword } = require('@services/model-helpers');
const { promiseError } = require('@services/error-helper');
const { profileSchema: { properties: profileSchema } } = require('@config-server/config');

class User extends Model {
  static async createUser({ login, email, password }) {
    const existUser = await this.findOne({ where: { [Op.or]: [{ email }, { login }] } })
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

  static async updateUser({ credentials, permission, login, newUserData }) {
    const userFromDB = await User.findOne({ where: { login } });
    if (userFromDB) {
      const isOwn = userFromDB.id === credentials.id;
      let updatedUserData;
      if (isOwn && permission.updateOwn.granted) {
        updatedUserData =
          await updateOwnUserData(permission.updateOwn.filter(newUserData), userFromDB);
      } else if (permission.updateAny.granted) {
        updatedUserData = 
          await updateAnyUserData(permission.updateAny.filter(newUserData), userFromDB);
      } else return promiseError("You don't have enough permissions for this", 403);
      Object.assign(userFromDB, updatedUserData);
      return userFromDB.save().then(userFromDB => userFromDB.get({ plain: true }))
        .catch(err => promiseError(err.original, 422))
    } else return promiseError("Can't find this user: " + login, 422);
  }

  static associate(models) {
    console.log('Models: ', models)
    this.hasMany(models.Sample);
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