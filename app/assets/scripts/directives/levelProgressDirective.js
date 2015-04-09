angular.module('PlaylinguaApp')
.directive('levelProgress',
  function() {
  return {
    template: '<div class="progress progress-striped">' +
      '<div class="progress-bar progress-bar-info" style="width: {{progressWidth}}%"></div>' +
      '</div>',
    };
  });
