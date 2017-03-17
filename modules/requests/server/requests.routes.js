'use strict';

/**
 * Module dependencies
 */
const requestsPolicy = require('./requests.policy');
const requests = require('./requests.controller');

module.exports = function(app) {
  // Requests Routes
  app.route('/api/requests').all(requestsPolicy.isAllowed)
    .get(requests.list)
    .post(requests.create);

  app.route('/api/requests/:requestId').all(requestsPolicy.isAllowed)
    .get(requests.read)
    .put(requests.update)
    .delete(requests.delete);

  // Finish by binding the Request middleware
  app.param('requestId', requests.requestByID);
};
