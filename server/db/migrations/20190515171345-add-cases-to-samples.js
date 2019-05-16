'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('samples', 'cases', {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('samples', 'cases');
  }
};
