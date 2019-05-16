'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'role');
  }
};
