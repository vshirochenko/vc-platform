angular.module('LogisticModule')
    .controller('LogisticModule.blade1Controller', ['$scope', '$timeout', 'LogisticModuleApi', 'platformWebApp.bladeNavigationService', function ($scope, $timeout, api, bladeNavigationService) {
        var blade = $scope.blade;
        
        function initializeBlade() {
            blade.title = 'LogisticModule';
            blade.isLoading = true;
            // Loading simulation
            $timeout(function() { blade.isLoading = false; }, 2000);

            $scope.gPlace = '';
            $scope.chosenFrom = '';
            $scope.chosenTo = '';
        };
        initializeBlade();

        blade.openNewBladeTest = function () {
            debugger;
            let newBlade = {
                id: 'GoogleMapsBlade',
                title: 'Hello!',
                template: '<div>Hello, tester=)</div>'
            };
            bladeNavigationService.showBlade(newBlade, blade);
        };
    }]);
