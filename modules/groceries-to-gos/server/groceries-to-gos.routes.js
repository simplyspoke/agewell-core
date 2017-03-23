'use strict';

/**
 * Module dependencies
 */
const groceriesToGosPolicy = require('./groceries-to-gos.policy');
const groceriesToGos = require('./groceries-to-gos.controller');

module.exports = function(app) {
  // Groceries to gos Routes
  app.route('/api/groceries-to-gos').all(groceriesToGosPolicy.isAllowed)
    .get(groceriesToGos.list)
    .post(groceriesToGos.create);

  app.route('/api/groceries-to-gos/:groceriesToGoId').all(groceriesToGosPolicy.isAllowed)
    .get(groceriesToGos.read)
    .put(groceriesToGos.update)
    .delete(groceriesToGos.delete);

  // Finish by binding the Groceries to go middleware
  app.param('groceriesToGoId', groceriesToGos.groceriesToGoByID);
};
