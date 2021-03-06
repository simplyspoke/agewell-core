(function() {
  'use strict';

  // Clients controller
  angular
    .module('clients')
    .controller('ClientsController', ClientsController);

  ClientsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'Notification', 'coreService', 'clientResolve'];

  function ClientsController($scope, $state, $window, Authentication, Notification, coreService, client) {
    var vm = this;

    vm.authentication = Authentication;
    vm.client = client;
    vm.options = coreService.getOptions('Client');
    vm.orders = coreService.getOptions('Order');
    vm.error = null;
    vm.remove = remove;
    vm.save = save;
    vm.toggle = toggle;
    vm.newOrder = newOrder;

    if (!vm.client._id) {
      vm.client.active = true;
      vm.client.groceryCallList = true;
      vm.client.contact = {
        address: {
          city: 'Duluth',
          state: 'MN'
        }
      };
    }

    vm.dates = {
      now: new Date(),
      orderBy: new Date(vm.orders.order[0]),
      nextOrderBy: new Date(vm.orders.order[1]),
      delivery: new Date(vm.orders.delivery[0]),
      nextDelivery: new Date(vm.orders.delivery[1])
    };

    vm.orderBy = vm.orders.order[0];
    if (vm.client.lastOrdered === vm.orderBy) {
      console.log('Already ordered');
    } else {
      console.log(vm.client.lastOrdered, vm.orderBy);
    }

    if (!vm.client.groceryCallList) {
      vm.client.groceryCallList = false;
    }

    // Remove existing Client
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.client.$remove($state.go('clients.list'));
      }
    }

    // Save Client
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.clientForm');
        return false;
      }

      vm.client.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('clients.view', {
          clientId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function toggle(field) {
      vm.client[field] = !vm.client[field];

      vm.client.$update(successCallback, errorCallback);

      function successCallback(res) {
        Notification.info({
          message: 'Update successful!'
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        vm.client[field] = !vm.client[field];
      }
    }

    function newOrder() {
      if (vm.client.lastOrdered === vm.orders.order[0]) {
        $state.go('order.edit', { clientId: vm.client.id, orderId: vm.client.lastOrder });
      } else {
        console.log(vm.client.lastOrder);
        $state.go('order.create', { clientId: vm.client.id, lastOrder: vm.client.lastOrder });
      }
    }
  }
}());
