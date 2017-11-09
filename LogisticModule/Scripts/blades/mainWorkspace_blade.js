angular.module('LogisticModule')
    .controller('LogisticModule.mainWorkspaceController', ['$scope', '$timeout', 'LogisticModuleApi', 'platformWebApp.bladeNavigationService', function ($scope, $timeout, api, bladeNavigationService) {
        var blade = $scope.blade;
        
        function initializeBlade() {
            blade.title = 'Logistic Module';
            blade.isLoading = true;
            // Loading simulation
            $timeout(function () { blade.isLoading = false; }, OPENING_BLADE_SIMULATION_DURATION);

            $scope.gPlace = '';
            $scope.chosenFrom = '';
            $scope.chosenTo = '';
        };
        initializeBlade();

        blade.openNewBladeTest = function () {
            let newBlade = {
                id: 'googleMaps_blade',
                title: 'Transportation visualization',
                controller: 'LogisticModule.googleMapsController',
                template: 'Modules/$(LogisticModule)/Scripts/blades/googleMaps_blade.tpl.html'
            };
            bladeNavigationService.showBlade(newBlade, blade);
        };
    }]);
