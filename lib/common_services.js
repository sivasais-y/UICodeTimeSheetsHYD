app.constant("baseURL", "/AG_SADCeFarms/")
    .constant("agSupportEmail", "efarmssupport@ag.nj.gov")

    .service('modalMessageService', [ '$log', 'modalService', '$uibModal',  function( $log, modalService, $uibModal ) {
        this.showMessage = function ( heading, message ) {
            var modalOptions = {
                actionButtonText: 'Close',
                closeButtonVisible: false,
                headerText: heading,
                bodyText: message
            };
            modalService.showModal({}, modalOptions, {})
                // We don't care about the response
                .then( function(response){}, function(){});
        };

    }]).service('modalService', [ '$log', '$uibModal',  function( $log, $uibModal ) {
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'templates/authadmin/modal.html'

        };

        var modalOptions = {
            closeButtonText: 'Close',
            closeButtonVisible: true,
            actionButtonText: 'OK',
            actionButtonVisible: true,
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions, resultToGet ) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            if (!resultToGet) resultToGet = {};
            $log.debug("in showModal resultToGet:", resultToGet);
            return this.show(customModalDefaults, customModalOptions, resultToGet );
        };

        this.show = function (customModalDefaults, customModalOptions, resultToGet ) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};
            var tmpResultToGet = resultToGet;

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = ('TempModalController', ['$scope', '$uibModalInstance',
                    function ($scope, $uibModalInstance, customModalDefaults) {
                        $scope.resultToGet = tmpResultToGet;
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (resultToGet) {
                            $uibModalInstance.close(resultToGet);
                        };
                        $scope.modalOptions.close = function () {
                            $uibModalInstance.dismiss('cancel');
                        };
                }]);
            }
            return $uibModal.open(tempModalDefaults).result;
        };
    }])
;

