(function() {
  'use strict';

  angular
    .module('groceries')
    .controller('PicklistController', PicklistController);

  PicklistController.$inject = ['$scope', '$state', '$stateParams', '$uibModal', 'Notification', 'OrdersService'];

  function PicklistController($scope, $state, $stateParams, $uibModal, Notification, OrdersService) {
    let vm = this;

    vm.picklist = [];
    vm.toggle = toggle;
    vm.complete = false;

    vm.orders = OrdersService.query({
      status: 'ordered'
    }, function(orders) {
      for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        let client = orders[i].contact;
        for (let j = 0; j < order.items.length; j++) {
          vm.picklist.push({
            name: order.items[j].name,
            keys: [i, j],
            category: order.items[j].category,
            qty: order.items[j].qty,
            client: client.firstName + ' ' + client.lastName,
            clientId: orders[i].clientId,
            orderId: orders[i]._id,
            inCart: order.items[j].inCart
          });
        }
      }
      checkList();
    });

    function toggle(itemData) {
      let order = vm.orders[itemData.keys[0]];
      let item = order.items[itemData.keys[1]];

      itemData.inCart = !itemData.inCart;
      item.inCart = !item.inCart;

      let orderComplete = order.items.every(function(listItem) {
        return listItem.inCart;
      });

      if (orderComplete) {
        order.status = 'incart';
      }

      order.$update(successCallback, errorCallback);

      function successCallback(res) {
        Notification.info({
          message: 'Update successful!'
        });
        checkList();
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        itemData.inCart = !itemData.inCart;
        item.inCart = !item.inCart;

        orderComplete = order.items.every(function(listItem) {
          return listItem.inCart;
        });

        if (!orderComplete) {
          order.status = 'ordered';
        }
      }
    }

    function checkList() {
      vm.complete = vm.picklist.every(function(listItem) {
        return listItem.inCart;
      });
      console.log(vm.complete);

      if (vm.complete) {
        console.log('complete');
        checkoutReady();
      }
    }

    function checkoutReady() {

      var modalInstance = $uibModal.open({
        animation: true,
        template: '<div class="modal-header"><h3 class="modal-title">Pick List Complete</h3></div>' +
          '<div class="modal-body">All the items on this picklist have been added to the cart. Would you like to continue to the checkout or stay here to review the cart?</div>' +
          '<div class="modal-footer">' +
          '<button class="btn btn-default" type="button" ng-click="vm.modalCancel()">Stay Here</button>' +
          '<button class="btn btn-success" type="button" ng-click="vm.modalOk()">Checkout</button>' +
          '</div>',
        scope: $scope
      });

      vm.modalOk = function() {
        modalInstance.close('OK Clicked');
        $state.go('groceries.checkout');
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

    console.log(vm);
  }
}());
