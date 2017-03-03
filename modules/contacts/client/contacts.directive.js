(function () {
  'use strict';

  angular
    .module('contacts')
    .directive('contactInformation', contactInformation);

  function contactInformation() {
    var directive = {
      restrict: 'E',
      scope: {
        contact: '=',
        error: '='
      },
      controller: 'ContactsController',
      controllerAs: 'vm',
      bindToController: true,
      templateUrl: '/modules/contacts/client/views/form-contact.html'
    };

    return directive;
  }
}());
