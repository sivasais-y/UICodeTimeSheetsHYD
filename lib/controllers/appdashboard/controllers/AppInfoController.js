(function() {
    'use strict';
}());
angular.module('agSADCeFarms')
        .controller('AppInfoController', ['$scope', '$state', '$log', 'applicationService', '$sce', '$http', '$window', function($scope, $state, $log, applicationService, $sce, $http, $window) {

        $log.debug("From Parent Controller:", $scope.$parent.dashboard_state);

        var checkID = applicationService.checkAppID($state.params.ID);

        if (checkID) {
            applicationService.fetchAppInfo($state.params.ID).then(
                    function(response) {
                        //console.log(response);
                        $scope.appInfo = response;
                    },
                    function(errResponse) {
                        console.error('Error while fetching Currencies');
                    }
            );
        }else{
            $scope.IDfailed = true;
        }
        
        $scope.redirectFarm = function(farmID){
            window.location.href = '#farm/'+farmID;
        };

    }]);
