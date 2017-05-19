(function() {
  'use strict';

  angular
    .module('groceries')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('groceries', {
        abstract: true,
        url: '/groceries',
        template: '<ui-view/>'
      })
      .state('groceries.list', {
        url: '/list',
        templateUrl: '/modules/groceries/client/views/picklist.html',
        controller: 'PicklistController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groceries To Go - Picklist'
        }
      })
      .state('groceries.checkout', {
        url: '/checkout',
        templateUrl: '/modules/groceries/client/views/checkout.html',
        controller: 'CheckoutController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groceries To Go - Checkout'
        }
      })
      .state('groceries.delivery', {
        url: '/delivery',
        templateUrl: '/modules/groceries/client/views/delivery.html',
        controller: 'DeliveryController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Groceries To Go - Delivery'
        }
        // })
        // .state('groceries.create', {
        //   url: '/order',
        //   templateUrl: 'modules/groceries/client/views/form-order.html',
        //   controller: 'GroceriesController',
        //   controllerAs: 'vm',
        //   resolve: {
        //     groceriesResolve: newGroceriesToGo
        //   },
        //   data: {
        //     roles: ['user', 'admin'],
        //     pageTitle: 'Groceries to gos Create'
        //   }
        // })
        // .state('groceries.edit', {
        //   url: '/:orderId/edit',
        //   templateUrl: 'modules/groceries/client/views/form-order.html',
        //   controller: 'GroceriesController',
        //   controllerAs: 'vm',
        //   resolve: {
        //     groceriesResolve: getGroceriesToGo
        //   },
        //   data: {
        //     roles: ['user', 'admin'],
        //     pageTitle: 'Edit Groceries to go {{ groceriesResolve.name }}'
        //   }
        // })
        // .state('groceries.view', {
        //   url: '/:orderId',
        //   templateUrl: 'modules/groceries/client/views/view-order.html',
        //   controller: 'GroceriesController',
        //   controllerAs: 'vm',
        //   resolve: {
        //     groceriesResolve: getGroceriesToGo
        //   },
        //   data: {
        //     pageTitle: 'Groceries to go {{ groceriesResolve.name }}'
        //   }
      });
  }

  getGroceriesToGo.$inject = ['$stateParams', 'GroceriesService'];

  function getGroceriesToGo($stateParams, GroceriesService) {
    return GroceriesService.get({
      groceriesToGoId: $stateParams.groceriesToGoId
    }).$promise;
  }

  newGroceriesToGo.$inject = ['GroceriesService'];

  function newGroceriesToGo(GroceriesService) {
    return new GroceriesService();
  }
}());
