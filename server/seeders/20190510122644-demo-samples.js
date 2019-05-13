'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('samples', [{
      title: 'One',
      description: 'One',
      rightAnswer: 'One'
    },{
      title: 'Two',
      description: 'Two',
      rightAnswer: 'Two'
    },{
      title: 'Three',
      description: 'Three',
      rightAnswer: 'Three'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('samples', null, {});
  }
};
