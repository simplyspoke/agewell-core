(function () {
  'use strict';

  angular
    .module('volunteers')
    .controller('ApproveVolunteersController', ApproveVolunteersController);
    // TODO: Make sure not senetive fields are not returned from the server.

  ApproveVolunteersController.$inject = ['$filter', 'Notification', 'AdminService'];

  function ApproveVolunteersController($filter, Notification, AdminService) {
    var vm = this;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.approve = approve;

    AdminService.query({
      roleRequested: 'volunteer'
    }, function(data) {
      vm.users = data;
      vm.buildPager();
    });
    console.log(vm);

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 10;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
        roleRequested: 'volunteer'
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function approve(user, index) {
      user.roles.push('volunteer');
      user.active = true;
      user.roleRequested = '';

      user.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        let userKey = ((vm.currentPage - 1) * vm.itemsPerPage) + index;
        vm.users.splice(userKey, 1);
        vm.figureOutItemsToDisplay();
        Notification.info({ message: 'Update successful!' });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
        user.roles.pop();
        user.roleRequested = 'volunteer';
      }
    }
  }
}());