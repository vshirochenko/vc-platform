angular
    .module('LogisticModule')
    .factory('GoogleMapsService', [function () {
        function initializeMap() {
            google.maps.visualRefresh = true;
            // Test coords
            const
                lat = 54.384036,
                lng = 20.645039;
            var bagrationovsk = new google.maps.LatLng(lat, lng);
            var mapOptions = {
                zoom: 15,
                center: bagrationovsk,
                mapTypeId: google.maps.MapTypeId.HYBRID
            };
            // Set maps into canvas element
            var map = new google.maps.Map(document.getElementById("GoogleMapsContainer"), mapOptions);
            // Configure marker
            var marker = new google.maps.Marker({
                position: bagrationovsk,
                map: map,
                title: 'Объект'
            });
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        };

        return {
            initMap: initializeMap
        };
    }]);
