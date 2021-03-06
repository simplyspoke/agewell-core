(function() {
  'use strict';

  // Groceries to gos controller
  angular
    .module('groceries.orders')
    .controller('ItemsController', ItemsController);

  ItemsController.$inject = ['$scope', '$state', '$filter', '$window', 'coreService'];

  function ItemsController($scope, $state, $filter, $window, coreService) {
    var vm = this;

    vm.options = coreService.getOptions('Grocery');
    vm.error = null;

    vm.saveItem = saveItem;
    vm.removeItem = removeItem;
    vm.addItem = addItem;
    vm.updateOrder = updateOrder;

    function saveItem(data, id) {
      angular.extend(data, {
        id: id
      });
      return console.log('Item Saved');
    }


    // remove user
    function removeItem(index) {
      vm.items.splice(index, 1);
    }

    // add user
    function addItem() {
      vm.inserted = {
        id: vm.items.length + 1,
        name: '',
        qty: '',
        category: ''
      };
      vm.items.push(vm.inserted);
    }

    function updateOrder() {
      $scope.$emit('updateOrder');
    }
  }
}());
