(function() {
  'use strict';

  // Rides controller
  angular
    .module('rides')
    .controller('RideFormController', RideFormController);

  RideFormController.$inject = ['$scope', '$state', '$filter', '$stateParams', '$window', '$uibModal', 'RidesService', 'Authentication', 'Notification', 'coreService', 'rideResolve'];

  function RideFormController($scope, $state, $filter, $stateParams, $window, $uibModal, RidesService, Authentication, Notification, coreService, ride) {
    var vm = this;

    vm.lastOrder = '';
    vm.authentication = Authentication;
    vm.ride = ride;
    vm.volunteers = coreService.getOptions('volunteers');
    // vm.assign = assign;
    vm.error = null;
    vm.print = print;

    function print() {
      window.print();
    }

    // Remove existing Rides to go
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.order.$remove($state.go('rides.orders.list'));
      }
    }

    // Assign an order to a volunteer.
    function assign() {
      if (vm.order.assignedTo) {
        vm.assignedTo = vm.order.assignedTo;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/rides/client/views/modals/assign.html',
        scope: $scope
      });

      vm.modalOk = function() {
        modalInstance.close('OK Clicked');

        vm.order.assignedTo = vm.assignedTo;
        vm.order.status = 'ordered';

        vm.order.createOrUpdate()
          .then(successCallback)
          .catch(errorCallback);

        function successCallback(res) {
          Notification.info({
            message: 'Update successful!'
          });

          vm.order.assignedTo = $filter('filter')(vm.volunteers, { _id: vm.assignedTo })[0];

        }

        function errorCallback(res) {
          vm.order.status = 'pending';
        }
      };

      vm.modalCancel = function() {
        modalInstance.dismiss('Cancel Clicked');
      };

      modalInstance.result.then(function() {
        console.log('Open Checkout Interface');
      }, function() {
        console.info('modal-component dismissed at: ' + new Date());
      });
    }
  }
}());
