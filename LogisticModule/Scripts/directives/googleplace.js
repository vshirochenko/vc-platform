//
// Google maps directive for autocomplete controls with selection geographic places
//
angular.module('LogisticModule')
    .directive('googleplace', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, model) {
                var options = {
                    types: [],
                    componentRestrictions: { 'country': [] }
                };
                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    let place = scope.gPlace.getPlace();
                    let lat = place.geometry.location.lat();
                    let lng = place.geometry.location.lng();
                    scope.$apply(function () {
                        model.$setViewValue(element.val());
                    });
                });
            }
        };
    });
