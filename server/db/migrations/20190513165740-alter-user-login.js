'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'login', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'login', {
      type: Sequelize.STRING
    })
  }
};
