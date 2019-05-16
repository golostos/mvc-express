'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('samples', [{
      title: 'One',
      description: 'One',
      rightAnswer: 'One',
      userId: 44,
      cases: '["One"]'
    },{
      title: 'Two',
      description: 'Two',
      rightAnswer: 'Two',
      userId: 44,
      cases: '["Two"]'
    },{
      title: 'Three',
      description: 'Three',
      rightAnswer: 'Three',
      userId: 44,
      cases: '["Three"]'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('samples', null, {});
  }
};
