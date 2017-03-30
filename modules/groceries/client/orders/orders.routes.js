(function() {
  'use strict';

  angular
    .module('groceries.orders')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('order', {
        abstract: true,
        url: '/clients/:clientId/orders',
        template: '<ui-view/>'
      })
      .state('order.create', {
        url: '/create',
        templateUrl: '/modules/groceries/client/views/form-order.html',
        controller: 'OrdersController',
        controllerAs: 'vm',
        resolve: {
          orderResolve: newOrder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Groceries To Go Order'
        }
      })
      .state('order.edit', {
        url: '/:orderId/edit',
        templateUrl: '/modules/groceries/client/views/form-order.html',
        controller: 'OrdersController',
        controllerAs: 'vm',
        resolve: {
          orderResolve: getOrder
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Groceries To Go Order'
        }
      })
      .state('order.view', {
        url: '/:orderId',
        templateUrl: '/modules/groceries/client/views/view-order.html',
        controller: 'OrdersController',
        controllerAs: 'vm',
        resolve: {
          orderResolve: getOrder
        },
        data: {
          pageTitle: 'Groceries To Go Order'
        }
      });
  }

  getOrder.$inject = ['$stateParams', 'OrdersService'];

  function getOrder($stateParams, OrdersService) {
    return OrdersService.get({
      orderId: $stateParams.orderId
    }).$promise;
  }

  newOrder.$inject = ['OrdersService'];

  function newOrder(OrdersService) {
    console.log('attempt new order');
    return new OrdersService();
  }
}());