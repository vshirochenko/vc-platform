angular.module('LogisticModule')
.factory('LogisticModuleApi', ['$resource', function ($resource) {
    return $resource('api/LogisticModule');
}]);
