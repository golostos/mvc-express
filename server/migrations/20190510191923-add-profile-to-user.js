'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'profile', {
      type: Sequelize.JSON,
      allowNull: false,
      // defaultValue: `{
      //   "facebook": "",
      //   "vk": "",
      //   "github": "",
      //   "twitter": "",
      //   "linkedIn": "",
      //   "aboutMe": ""
      // }`
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'profile');
  }
};
