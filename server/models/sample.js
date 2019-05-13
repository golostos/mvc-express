'use strict';
const Model = require('sequelize').Model;

class Sample extends Model {
  static associate(models) {
    // associations can be defined here
  }
}

module.exports = (sequelize, DataTypes) => {
  Sample.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    rightAnswer: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sample',
  });
  return Sample;
};