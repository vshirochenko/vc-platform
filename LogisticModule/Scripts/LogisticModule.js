//Call this to register our module to main application
var moduleTemplateName = "LogisticModule";

if (AppDependencies != undefined) {
    AppDependencies.push(moduleTemplateName);
}

angular.module(moduleTemplateName, [])
.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('workspace.LogisticModule', {
                url: '/LogisticModule',
                templateUrl: '$(Platform)/Scripts/common/templates/home.tpl.html',
                controller: [
                    '$scope', 'platformWebApp.bladeNavigationService', function ($scope, bladeNavigationService) {
                        var newBlade = {
                            id: 'blade1',
                            controller: 'LogisticModule.blade1Controller',
                            template: 'Modules/$(LogisticModule)/Scripts/blades/logisticModule_blade1.tpl.html',
                            isClosingDisabled: true
                        };
                        bladeNavigationService.showBlade(newBlade);
                    }
                ]
            });
    }
])
.run(['$rootScope', 'platformWebApp.mainMenuService', 'platformWebApp.widgetService', '$state',
    function ($rootScope, mainMenuService, widgetService, $state) {
        //Register module in main menu
        var menuItem = {
            path: 'browse/LogisticModule',
            icon: 'fa fa-cube',
            title: 'LogisticModule',
            priority: 100,
            action: function () { $state.go('workspace.LogisticModule') },
            permission: 'LogisticModulePermission'
        };
        mainMenuService.addMenuItem(menuItem);
    }
]);
