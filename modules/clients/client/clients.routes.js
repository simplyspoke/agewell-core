(function () {
  'use strict';

  angular
    .module('clients')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('clients', {
        abstract: true,
        url: '/clients',
        template: '<ui-view/>'
      })
      .state('clients.list', {
        url: '',
        templateUrl: '/modules/clients/client/views/list-clients.html',
        controller: 'ClientsListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: 'Clients List'
        }
      })
      .state('clients.create', {
        url: '/create',
        templateUrl: '/modules/clients/client/views/form-client.html',
        controller: 'ClientsController',
        controllerAs: 'vm',
        resolve: {
          clientResolve: newClient
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Clients Create'
        }
      })
      .state('clients.edit', {
        url: '/:clientId/edit',
        templateUrl: '/modules/clients/client/views/form-client.html',
        controller: 'ClientsController',
        controllerAs: 'vm',
        resolve: {
          clientResolve: getClient
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Client {{ clientResolve.name }}'
        }
      })
      .state('clients.view', {
        url: '/:clientId',
        templateUrl: '/modules/clients/client/views/view-client.html',
        controller: 'ClientsController',
        controllerAs: 'vm',
        resolve: {
          clientResolve: getClient
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Client {{ clientResolve.name }}'
        }
      });
  }

  getClient.$inject = ['$stateParams', 'ClientsService'];

  function getClient($stateParams, ClientsService) {
    return ClientsService.get({
      clientId: $stateParams.clientId
    }).$promise;
  }

  newClient.$inject = ['ClientsService'];

  function newClient(ClientsService) {
    return new ClientsService();
  }
}());
