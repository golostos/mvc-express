'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('samples', 'userId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('samples', 'userId');
  }
};
