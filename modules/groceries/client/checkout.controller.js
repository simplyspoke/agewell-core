(function() {
  'use strict';

  angular
    .module('groceries')
    .controller('CheckoutController', CheckoutController);

  CheckoutController.$inject = ['$scope', '$stateParams', '$state', '$timeout', '$uibModal', 'Notification', 'OrdersService', 'Upload'];

  function CheckoutController($scope, $stateParams, $state, $timeout, $uibModal, Notification, OrdersService, Upload) {
    var vm = this;

    vm.clientid = $stateParams.clientId;
    vm.picklist = [];
    vm.complete = false;

    vm.checkout = checkout;
    vm.totals = totals;
    vm.updateOrder = updateOrder;
    vm.upload = upload;

    vm.askedNextStep = false;

    vm.orders = OrdersService.query({
      status: 'incart'
    }, function(orders) {
      checkList();
    });


    function checkout(order) {
      vm.current = order;

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/groceries/client/views/modals/checklist.html',
        scope: $scope
      });

      vm.modalOk = function() {
        modalInstance.close('OK Clicked');
        receipt(order);
      };
      vm.modalCancel = function() {
        modalInstance.dismiss('Cancel Clicked');
      };
    }


    function receipt(order) {
      vm.current = order;

      var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: '/modules/groceries/client/views/modals/reciept.html',
        scope: $scope
      });

      vm.modalOk = function() {
        modalInstance.close('OK Clicked');

        // TODO: Make the reciept optional
        if (vm.current.recieptTotal !== 0 && (vm.current.hasOwnProperty('recieptImage') && vm.current.recieptImage !== '') && (vm.current.hasOwnProperty('storeName') && vm.current.storeName !== '')) {
          vm.current.status = 'purchased';
        } else {
          vm.current.status = 'incart';
        }

        updateOrder();
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

    function updateOrder() {
      vm.current.$update(successCallback, errorCallback);

      function successCallback(res) {
        Notification.info({
          message: 'Update successful!'
        });
        checkList();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    function totals() {
      if (isNaN(vm.current.recieptTotal)) {
        return Notification.error({
          message: 'Reciept Total is needs to be a number.',
          title: '<i class="glyphicon glyphicon-remove"></i> Invalid Input!'
        });
      }
      vm.current.recieptTotal = (Math.round(vm.current.recieptTotal * 100) / 100).toFixed(2);
      vm.current.total = vm.current.deliveryCost + +vm.current.recieptTotal;

      updateOrder();
    }

    function upload(dataUrl) {

      Upload.upload({
        url: '/api/orders/' + vm.current._id + '/reciept',
        data: {
          reciept: dataUrl
        }
      }).then(function(response) {
        $timeout(function() {
          onSuccessItem(response.data);
        });
      }, function(response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function(evt) {
        vm.progress = parseInt((100.0 * evt.loaded) / evt.total, 10);
      });
    }

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({
        message: '<i class="glyphicon glyphicon-ok"></i> Successfully uploaded reciept'
      });

      // Reset form
      vm.current.recieptImage = response.recieptImage;
      vm.fileSelected = false;
      vm.progress = 0;
    }

    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({
        message: response.message,
        title: '<i class="glyphicon glyphicon-remove"></i> Failed to upload reciept'
      });
    }

    function checkList() {
      vm.complete = vm.orders.every(function(order) {
        return order.status === 'purchased';
      });

      if (!vm.askedNextStep && vm.complete && vm.orders.length !== 0) {
        delivery();
      }
    }

    function delivery() {
      var header = 'Checkout Incomplete';
      var message = 'Some of the orders have not been checked out. Are you sure you would like to continue?';
      var buttonClass = 'danger';

      if (vm.complete) {
        header = 'Checkout Complete';
        message = 'All the orders have been checkedout and paid for. Would you like to continue to the delivery or stay here to review the orders?';
        buttonClass = 'success';

        vm.askedNextStep = true;
      }

      var modalInstance = $uibModal.open({
        animation: true,
        template: '<div class="modal-header"><h3 class="modal-title">' + header + '</h3></div>' +
          '<div class="modal-body">' + message + '</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" type="button" ng-click="vm.modalCancel()">Stay Here</button>' +
          '<button class="btn btn-' + buttonClass + '" type="button" ng-click="vm.modalOk()">Delivery</button>' +
          '</div>',
        scope: $scope
      });

      vm.modalOk = function() {
        modalInstance.close('OK Clicked');
        $state.go('groceries.delivery');
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
