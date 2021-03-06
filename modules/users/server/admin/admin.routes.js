'use strict';

/**
 * Module dependencies
 */
var adminPolicy = require('./admin.policy'),
  admin = require('./admin.controller');

module.exports = function (app) {
  // User route registration first. Ref: #713
  require('../users.routes.js')(app);

  // Users collection routes
  app.route('/api/users')
    .get(adminPolicy.isAllowed, admin.list);

  // Single user routes
  app.route('/api/users/:userId')
    .get(adminPolicy.isAllowed, admin.read)
    .put(adminPolicy.isAllowed, admin.update)
    .delete(adminPolicy.isAllowed, admin.delete);

  // Finish by binding the user middleware
  app.param('userId', admin.userByID);
};
