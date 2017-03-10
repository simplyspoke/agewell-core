(function () {
  'use strict';

  // Setting up route
  angular
    .module('services.admin')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.services', {
        url: '/services',
        templateUrl: '/modules/services/client/admin/views/list-services.html',
        controller: 'ServicesAdminListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Services List'
        }
      })
      .state('admin.services.view', {
        url: '/:serviceId',
        templateUrl: '/modules/services/client/admin/views/view-service.html',
        controller: 'ServicesAdminController',
        controllerAs: 'vm',
        resolve: {
          serviceResolve: getService
        },
        data: {
          pageTitle: 'Edit {{ serviceResolve.displayName }}'
        }
      })
      .state('admin.services.create', {
        url: '/create',
        templateUrl: 'modules/services/client/views/form-service.html',
        controller: 'ServicesAdminController',
        controllerAs: 'vm',
        resolve: {
          serviceResolve: newService
        },
        data: {
          pageTitle: 'Services Create'
        }
      })
      .state('admin.services.edit', {
        url: '/:serviceId/edit',
        templateUrl: '/modules/services/client/admin/views/edit-service.html',
        controller: 'ServicesAdminController',
        controllerAs: 'vm',
        resolve: {
          serviceResolve: getService
        },
        data: {
          pageTitle: 'Edit Service {{ serviceResolve.name }}'
        }
      });

    getService.$inject = ['$stateParams', 'ServicesAdminService'];

    function getService($stateParams, ServicesAdminService) {
      return ServicesAdminService.get({
        serviceId: $stateParams.serviceId
      }).$promise;
    }

    newService.$inject = ['ServicesAdminService'];

    function newService(ServicesAdminService) {
      return new ServicesAdminService();
    }
  }
}());
