app.controller('AppScoreController', ['$scope', '$state', '$log', 'applicationService', '$sce', '$http', '$window', 'modalService', 'modalMessageService', '$uibModal', '$rootScope', function ($scope, $state, $log, applicationService, $sce, $http, $window, modalService, modalMessageService, $uibModal, $rootScope) {

                $rootScope.getAppScores = function () {
                    applicationService.fetchAppScores($state.params.ID).then(
                            function (response) {
                                $rootScope.gridAppScores.data = response;
                            },
                            function (errResponse) {
                                $rootScope.gridAppScores.data = {};
                                toastr.clear();
                                toastr.error('Bad Connectivity / Server Down', 'Error while fetching App Scores');
                            }
                    );
                };

                $rootScope.getAppScoreTypes = function () {
                    applicationService.fetchAddScoreTypes($state.params.ID).then(
                            function (response) {
                                //return response;
                                $rootScope.scoreTypes = response;
                                console.log($rootScope.scoreTypes);
                            },
                            function (errResponse) {
                                toastr.clear();
                                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Status Details');
                                return {};
                            }
                    );
                };


                var checkID = applicationService.checkAppID($state.params.ID);

                if (checkID) {

                    var delBTNTemplate = "<div class='ui-grid-cell-contents'> <button class='btn btn-danger' ng-click='grid.appScope.deleteScore(row.entity.score_guid);$event.stopPropagation();' style='padding:2px 5px;margin:-4px auto 0'><i class='fa fa-trash-o'></i></button> </div>";
                    //var userTemplate = "<div class='ui-grid-cell-contents' ng-mouseover='grid.appScope.showUsersPop($event,row.entity.users)'><span class='userData' ng-repeat='user in row.entity.users track by $index'> {{user.salutation }} {{user.first_name }} {{user.last_name }} </span></br></div>";
                    //var roleTemplate = "<div class='ui-grid-cell-contents' ng-mouseover='grid.appScope.showRolesPop($event,row.entity.roles)'><span class='roleData' ng-repeat='role in row.entity.roles track by $index'> {{role.auth_role_name}}</span></br></div>";
                    $rootScope.gridAppScores = {
                        paginationPageSizes: false,
                        enableFiltering: true,
                        enableRowSelection: true,
                        enableColumnResizing: true,
                        multiSelect: false,
                        resizable: true,
                        enableFullRowSelection: true,
                        paginationPageSize: 25,
                        appScopeProvider: $scope,
                        rowTemplate: '<div ng-click="grid.appScope.viewAppScore(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell " ng-class="col.colIndex()" ui-grid-cell></div>',
                        columnDefs: [
                            {name: 'score_type', displayName: 'Type', cellTooltip: true},
                            {name: 'score_status', displayName: 'Status', cellTooltip: true},
                            {name: 'score', displayName: 'Score', cellTooltip: true},
                            {name: 'application_id', displayName: 'Appilication ID', cellTooltip: true},
                            {name: 'created_user', displayName: 'Created User', cellTooltip: true},
                            {name: 'last_edited_user', displayName: 'Last Edited User', cellTooltip: true},
                            {name: 'score_guid', displayName: '', width: '60', cellTooltip: false, enableFiltering: false, enableSorting: false, cellTemplate: delBTNTemplate}
                        ]
                    };

                    $rootScope.gridAppScores.onRegisterApi = function (gridApiAppScores) {
                        $rootScope.gridApiScores = gridApiAppScores;
                    };

                    $rootScope.getAppScores();

                    $scope.viewAppScore = function (row) {
                        //console.log(row.entity);
                        var modalInstance = $uibModal.open({
                            templateUrl: 'views/application/appEditScore.html',
                            controller: 'editScoreCtrl',
                            size: 'md',
                            backdrop: 'static',
                            resolve: {
                                scoreOBJ: function () {
                                    return row.entity;
                                }
                            }
                        });

                        modalInstance.result.then(function (selectedItem) {
                            //$scope.selected = selectedItem;
                        }, function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });
                    };

                    $scope.addScore = function () {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'views/application/appAddScore.html',
                            controller: 'addScoreCtrl',
                            size: 'md',
                            backdrop: 'static',
                            resolve: {
                            }
                        });

                        modalInstance.result.then(function (selectedItem) {
                            //$scope.selected = selectedItem;
                        }, function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                    };

                    $scope.deleteScore = function (delScoreGUID) {
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'Yes',
                            headerText: 'Warning',
                            bodyText: 'Are you sure you want to delete this Score?'
                        };
                        modalService.showModal({}, modalOptions)
                                .then(function (result) {
                                    applicationService.deleteAppScore(delScoreGUID, $state.params.ID).then(
                                            function (response) {
                                                $rootScope.getAppScores();
                                                modalMessageService.showMessage("Success:", "Score deleted Successfully");
                                            },
                                            function (errResponse) {
                                                toastr.clear();
                                                toastr.error('Bad Connectivity / Server Down', 'Error while deleting Score');
                                            }
                                    );
                                });
                    };
                }

            }]).controller('addScoreCtrl', function ($scope, $rootScope, $uibModal, $filter, $window, $uibModalInstance, applicationService, $state) {

    $rootScope.getAppScoreTypes();

    $scope.addScoreSubmit = function () {

        if ($scope.addScoreType != '' && $scope.addScoreType != null && $scope.addScoreType != undefined) {
            var postBody = {
                'name': $scope.addScoreName,
                'description': $scope.addScoreDesc,
                'score_type_guid': $scope.addScoreType.score_type_guid,
                'application_id': $state.params.ID
            };

            applicationService.postAppScore(postBody, $state.params.ID).then(
                    function (response) {
                        $rootScope.getAppScores();
                    },
                    function (errResponse) {
                        toastr.clear();
                        toastr.error('Bad Connectivity / Server Down', 'Error while posting App Score');
                    }
            );
            $uibModalInstance.dismiss();
        } else {
            $('#appAddScoreType').closest('.form-group').addClass('has-error');
            toastr.clear();
            toastr.error('Please select Score Type', 'Error while posting App Score');
        }
    };

    $scope.addScoreCancel = function () {
        $uibModalInstance.dismiss();
    };
}).controller('editScoreCtrl', function (scoreOBJ, $scope, $rootScope, $uibModal, $filter, $window, $uibModalInstance, applicationService, $state) {

    applicationService.getEditAppScore(scoreOBJ.score_guid, $state.params.ID).then(
            function (response) {
                $scope.editAppScore = response;
                $scope.editScoreKeys = {};
                $.each($scope.editAppScore.score_json.categories, function (index, value) {
                    var arr = Object.keys(value.factors);
                    $scope.editScoreKeys[index] = arr.sort();
                });

                $scope.scoreObj = scoreOBJ;
                $scope.putScoreName = scoreOBJ.name;
                $scope.putScoreStatus = scoreOBJ.score_status;
                $scope.putScoreDescription = scoreOBJ.description;

                $scope.scoreGUID = $scope.editAppScore.score_guid;
                $scope.editable = false;
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching App Score');
            }
    );

    applicationService.getAppScoreStatus($state.params.ID).then(
            function (response) {
                $scope.scoreStatus = response;
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching App Score Status');
            }
    );

    $scope.putBody = {};

    $scope.submitPutScore = function () {

        if ($scope.editable) {

            var putData = {
                "name": $scope.putScoreName,
                "description": $scope.putScoreDescription,
                "score_status": $scope.putScoreStatus,
                "inputs": {}
            };
            angular.forEach($scope.putBody, function (value, key) {
                putData.inputs[key] = value;
            });

            applicationService.putAppScore(putData, $state.params.ID, $scope.scoreGUID).then(
                    function (response) {
                        $rootScope.getAppScores();
                        //$uibModalInstance.dismiss();
                    },
                    function (errResponse) {
                        toastr.clear();
                        toastr.error('Bad Connectivity / Server Down', 'Error while posting App Score');
                        $scope.editable = !$scope.editable;
                    }
            );
        }

        $scope.editable = !$scope.editable;
    };

    $scope.editPutScore = function () {
        $scope.editable = !$scope.editable;

        if ($scope.editable) {
            toastr.clear();
            toastr.success('Editable', 'Now you can Edit Score form');
        } else {
            toastr.clear();
            toastr.warning('Non-Editable', 'Now you can Read Score form');
        }
    };

    $scope.cancelPutScore = function () {
        $uibModalInstance.dismiss();
    };


});