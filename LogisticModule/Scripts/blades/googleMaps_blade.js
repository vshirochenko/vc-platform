angular
    .module('LogisticModule')
    .controller('LogisticModule.googleMapsController', ['$scope', '$timeout', 'GoogleMapsService', function ($scope, $timeout, googleMapsService) {
        let blade = $scope.blade;
        let initializeBlade = function() {
            blade.isLoading = true;
            $timeout(function () {
                blade.isLoading = false;
                googleMapsService.initMap();
            }, OPENING_BLADE_SIMULATION_DURATION);
        };
        initializeBlade();
    }]);
