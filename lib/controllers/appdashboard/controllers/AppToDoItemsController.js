app.controller('AppToDoItemsController', ['$rootScope', '$scope', '$state', '$log', '$uibModal', 'applicationService', '$sce', '$http', '$window', function ($rootScope, $scope, $state, $log, $uibModal, applicationService, $sce, $http, $window) {

                $log.debug("From Parent Controller:", $scope.$parent.dashboard_state);

                var checkID = applicationService.checkAppID($state.params.ID);

                if (checkID) {
                    var stateTemplate = "<div class='ui-grid-cell-contents'> {{row.entity.todo_item_completed_flg ? 'Completed' : 'Incomplete'}} </div>";
                    var userTemplate = "<div class='ui-grid-cell-contents' ng-mouseover='grid.appScope.showUsersPop($event,row.entity.users)'><span class='userData' ng-repeat='user in row.entity.users track by $index'> {{user.salutation }} {{user.first_name }} {{user.last_name }} </span></br></div>";
                    var roleTemplate = "<div class='ui-grid-cell-contents' ng-mouseover='grid.appScope.showRolesPop($event,row.entity.roles)'><span class='roleData' ng-repeat='role in row.entity.roles track by $index'> {{role.auth_role_name}}</span></br></div>";
                    $rootScope.toDoItemsGridAll = {
                        paginationPageSizes: false,
                        enableFiltering: true,
                        enableRowSelection: true,
                        enableColumnResizing: true,
                        multiSelect: false,
                        resizable: true,
                        enableFullRowSelection: true,
                        paginationPageSize: 25,
                        appScopeProvider: $scope,
                        rowTemplate: '<div ng-click="grid.appScope.viewToDo(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell " rowStatus = "{{row.entity.todo_item_completed_flg}}" ng-class="col.colIndex()" ui-grid-cell></div>',
                        columnDefs: [
                            {name: 'todo_item_title', displayName: 'Title', width: '250', cellTooltip: true},
                            {name: 'assigner', displayName: 'Assigner', width: '150', cellTooltip: true},
                            {name: 'created_date', displayName: 'Date Created', width: '120', cellFilter: 'date:"MMM dd,y"'},
                            {name: 'todo_item_completed_flg', displayName: 'Status', width: '100', cellTooltip: true, cellTemplate: stateTemplate},
                            {name: 'todo_item_due_date', displayName: 'Due Date', width: '120', cellFilter: 'date:"MMM dd,y"'},
                            {name: 'application_phase', displayName: 'Due Phase', width: '120'},
                            {name: 'completed_date', displayName: 'Date Completed', width: '150', cellFilter: 'date:"MMM dd,y"'},
                            {name: 'completed_user', displayName: 'Completed By', width: '120', cellTooltip: true},
                            {name: 'users', displayName: 'Users', cellTooltip: true, width: '400', cellTemplate: userTemplate},
                            {name: 'roles', displayName: 'Roles', cellTooltip: true, width: '325', cellTemplate: roleTemplate}
                        ]
                    };
                    $rootScope.toDoItemsGridToMe = {
                        paginationPageSizes: false,
                        enableFiltering: true,
                        enableRowSelection: true,
                        enableColumnResizing: true,
                        multiSelect: false,
                        resizable: true,
                        enableFullRowSelection: true,
                        paginationPageSize: 25,
                        appScopeProvider: $scope,
                        rowTemplate: '<div ng-click="grid.appScope.viewToDo(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell " rowStatus = "{{row.entity.todo_item_completed_flg}}" ng-class="col.colIndex()" ui-grid-cell></div>',
                        columnDefs: [
                            {name: 'todo_item_title', displayName: 'Title', width: '250', cellTooltip: true},
                            {name: 'assigner', displayName: 'Assigner', width: '150', cellTooltip: true},
                            {name: 'created_date', displayName: 'Date Created', width: '120', cellFilter: 'date:"MMM dd,y"'},
                            {name: 'todo_item_completed_flg', displayName: 'Status', width: '100', cellTooltip: true, cellTemplate: stateTemplate},
                            {name: 'todo_item_due_date', displayName: 'Due Date', width: '120', cellFilter: 'date:"MMM dd,y"'},
                            {name: 'application_phase', displayName: 'Due Phase', width: '120'},
                            {name: 'completed_date', displayName: 'Date Completed', width: '150', cellFilter: 'date:"MMM dd,y"'},
                            {name: 'completed_user', displayName: 'Completed By', width: '130', cellTooltip: true},
                            {name: 'users', displayName: 'Users', cellTooltip: true, width: '400', cellTemplate: userTemplate},
                            {name: 'roles', displayName: 'Roles', cellTooltip: true, width: '325', cellTemplate: roleTemplate}
                        ]
                    };

                    $scope.showUsersPop = function (event, userData) {
                        event.stopPropagation();
                        console.log(userData, event);
                    };
                    $scope.showRolesPop = function (event, roleData) {
                        event.stopPropagation();
                        console.log(roleData);
                    };

                    $rootScope.toDoItemsGridAll.onRegisterApi = function (gridApi) {
                        $rootScope.gridApi3 = gridApi;
                    };

                    $scope.toDoItemsGridToMe.onRegisterApi = function (gridApiToMe) {
                        $rootScope.gridApi4 = gridApiToMe;
                    };

                    applicationService.fetchAppToDoList($state.params.ID).then(
                            function (response) {
                                $rootScope.toDoItemsGridAll.data = response;
                                //$scope.toDoItemslist = response;
                            },
                            function (errResponse) {
                                toastr.clear();
                                toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Items List');
                            }
                    );
                    applicationService.fetchAppToDoListToMe($state.params.ID).then(
                            function (response) {
                                $rootScope.toDoItemsGridToMe.data = response;
                                //$scope.toDoItemslist = response;
                            },
                            function (errResponse) {
                                toastr.clear();
                                toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Items List');
                            }
                    );
                } else {
                    $scope.IDfailed = true;
                }

                $scope.viewToDo = function (row) {
                    var toDoGUID = row.entity.todo_item_guid;
                    //console.log(row.entity);
                    //$scope.dataObj = {};
                    if (toDoGUID) {
                        var dataObj = applicationService.fetchAppToDoItem(toDoGUID).then(
                                function (response) {
                                    return response;
                                    //$scope.dataObj = response; //console.log(dataObj);
                                },
                                function (errResponse) {
//                                    return {};
                                    console.error('Error while fetching ToDo Item');
                                }
                        );
                        //console.log(dataObj);
                        var modalInstance = $uibModal.open({
                            templateUrl: 'editToDoItem.html',
                            controller: 'editToDoItemCtrl',
                            size: 'lg',
                            backdrop: 'static',
                            resolve: {
                                Itemdata: function () {
                                    return dataObj;
                                }
                            }
                        });

                        modalInstance.result.then(function (selectedItem) {
                            //$scope.selected = selectedItem;
                        }, function () {
                            $rootScope.gridApi3.selection.getSelectedRows();
                            $log.info('Modal dismissed at: ' + new Date());
                        });

                    } else {
                        toastr.clear();
                        //toastr.error('Due to Invalid/Empty ToDoItemGUID', 'Error while fetching ToDo Item Details');
                        //console.log('Error while fetching ToDo Item Details Due to Invalid/Empty ToDoItemGUID');
                    }
                };

                $scope.addToDoItem = function () {

                    var modalInstance = $uibModal.open({
                        templateUrl: 'createToDoItem.html',
                        controller: 'createToDoItemCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        //$scope.selected = selectedItem;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

                $scope.loadToDoItem = function () {

                    var modalInstance = $uibModal.open({
                        templateUrl: 'views/application/loadToDoItem.html',
                        controller: 'loadToDoItemCtrl',
                        size: 'lg',
                        backdrop: 'static',
                        resolve: {
                        }
                    });

                    modalInstance.result.then(function (selectedItem) {
                        //$scope.selected = selectedItem;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });
                };

            }]).controller('editToDoItemCtrl', function ($scope, $rootScope, $uibModal, modalMessageService, modalService, applicationService, $filter, $window, $uibModalInstance, Itemdata, $state) {
    $scope.appToDoSingleItem = Itemdata;

    $scope.dateOptions = {
        formatYear: 'yyyy',
        maxDate: new Date(2022, 5, 22),
        minDate: new Date(1975, 1, 01),
        startingDay: 1
    };

    $scope.today = function () {
        if (Itemdata && Itemdata.todo_item_due_date != null && Itemdata.todo_item_due_date != undefined) {
            $scope.dt = new Date(Itemdata.todo_item_due_date);
        }
    };
    
    $scope.today();
    $scope.datePick = {};
    $scope.openDate = false;

    applicationService.fetchToDoPhaseDetails($state.params.ID).then(
            function (response) {
                //return response;
                $scope.phaseList = response; //console.log(dataObj);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Phase Details');
                return {};
            }
    );

    $scope.addUser = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'views/application/appAddUser.html',
            controller: 'addUserToDoItemCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                userData: function () {
                    return $scope.appToDoSingleItem.users;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteUser = function (userIndex) {
        delete  $scope.editToDo.user[userIndex];
        $scope.appToDoSingleItem.users.splice(userIndex, 1);
        //console.log($scope.editToDo.user);
    };

    $scope.addRole = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'views/application/appAddRole.html',
            controller: 'addRoleToDoItemCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                roleData: function () {
                    return $scope.appToDoSingleItem.roles;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteRole = function (roleIndex) {
        //$scope.editToDo.role.splice(roleIndex,1);
        delete  $scope.editToDo.role[roleIndex];
        //console.log($scope.editToDo.role);
        $scope.appToDoSingleItem.roles.splice(roleIndex, 1);
    };

    $scope.saveItem = function () {
        
        var dueDate = $scope.editToDo.dueDate ? $filter('date')($scope.editToDo.dueDate, "yyyy-MM-dd").split('-') : null;
        
        //console.log(dueDate,  new Date(dueDate[0], dueDate[1]-1, dueDate[2]));

        var putData = {
            "todo_item_guid": $scope.editToDo.ItemGUID,
            "todo_item_title": $scope.editToDo.title,
            "todo_item_desc": $scope.editToDo.desc,
            "todo_item_due_date": (dueDate != null && dueDate.length > 1) ? dueDate[0]+'-'+dueDate[1]+'-'+ dueDate[2] : null,
            "todo_item_conditional_flg": $scope.editToDo.conditional ? true : false,
            "farm_id": $scope.editToDo.farmID,
            "application_id": $state.params.ID,
            "application_phase_guid": $scope.editToDo.phaseDate ? $scope.editToDo.phaseDate.application_phase_guid : null,
            "users": [],
            "roles": []
        };
        angular.forEach($scope.editToDo.user, function (value, index) {
            var tempUser = {
                "auth_user_guid": value.guid,
                "salutation": value.salutation,
                "first_name": value.first_name,
                "last_name": value.last_name,
                "title": value.title,
                "organization": value.organization
            };
            putData.users.push(tempUser);
        });
        angular.forEach($scope.editToDo.role, function (value, index) {
            var tempRole = {
                "auth_role_guid": value.guid,
                "auth_role_name": value.name
            };
            putData.roles.push(tempRole);
        });
        //console.log(putData);
        if ($scope.editToDo.conditional == true && $scope.editToDo.phaseDate == null) {
            toastr.clear();
            toastr.error('Please select Phase Details', 'Error posting Data');
        } else {
            applicationService.editAppToDoItem(putData, $scope.editToDo.ItemGUID).then(
                    function (response) {
                        //$window.location.reload();
                        //console.log(response);

                        applicationService.fetchAppToDoList($state.params.ID).then(
                                function (response) {
                                    $rootScope.toDoItemsGridAll.data = response;
                                    //$scope.toDoItemslist = response;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Items List');
                                }
                        );
                        applicationService.fetchAppToDoListToMe($state.params.ID).then(
                                function (response) {
                                    $rootScope.toDoItemsGridToMe.data = response;
                                    //$scope.toDoItemslist = response;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Items List');
                                }
                        );
                        $uibModalInstance.close('save');
                    },
                    function (errResponse) {
                        toastr.clear();
                        toastr.error('Bad Connectivity / Server Down', 'Error while updating ToDoItem');
                    }
            );
        }

        //$uibModalInstance.close('Save');
    };

    $scope.deleteItem = function (delToDoGUID) {
        var modalOptions = {
            closeButtonText: 'No',
            actionButtonText: 'Yes',
            headerText: 'Warning',
            bodyText: 'Are you sure you want to delete this item?'
        };
        modalService.showModal({}, modalOptions)
                .then(function (result) {
                    applicationService.deleteAppToDoItem(delToDoGUID).then(
                            function (response) {
                                $window.location.reload();
                                modalMessageService.showMessage("Success:", "Contact deleted Successfully");
                                //console.log(response);
                                $uibModalInstance.close('Delete');
                            },
                            function (errResponse) {
                                toastr.clear();
                                toastr.error('Bad Connectivity / Server Down', 'Error while deleting ToDoItem');
                            }
                    );
                    console.log(delToDoGUID);
                });
    };

    $scope.markItem = function (markToDoGUID) {
        applicationService.markAppToDoList(markToDoGUID).then(
                function (response) {
                    //console.log(response);
                    $uibModalInstance.close('Mark Completed');
                },
                function (errResponse) {
                    console.error('Error while marking Item as Completed');
                }
        );
        console.log(markToDoGUID);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('Cancel');
    };
}).controller('createToDoItemCtrl', function ($scope, $rootScope, $uibModal, $filter, $window, $uibModalInstance, applicationService, $state) {
    $scope.toDoItem = {
        users: [],
        roles: []
    };

    $scope.dateOptionsAddItem = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
    };

    $scope.today = function () {
        $scope.presentDate = new Date();
    };
    $scope.today();
    $scope.datePick = {};

    applicationService.fetchToDoPhaseDetails($state.params.ID).then(
            function (response) {
                //return response;
                $scope.phaseList = response; //console.log(dataObj);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Phase Details');
                return {};
            }
    );

    $scope.addUser = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'views/application/appAddUser.html',
            controller: 'addUserToDoItemCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                userData: function () {
                    return $scope.toDoItem.users;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteUser = function (userIndex) {
        delete  $scope.toDoItem.users[userIndex];
        $scope.toDoItem.users.splice(userIndex, 1);
    };

    $scope.addRole = function () {

        var modalInstance = $uibModal.open({
            templateUrl: 'views/application/appAddRole.html',
            controller: 'addRoleToDoItemCtrl',
            size: 'lg',
            backdrop: 'static',
            resolve: {
                roleData: function () {
                    return $scope.toDoItem.roles;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            //$scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.deleteRole = function (roleIndex) {
        delete  $scope.toDoItem.roles[roleIndex];
        $scope.toDoItem.roles.splice(roleIndex, 1);
    };


    $scope.createItem = function () {
        var postData = {
            "todo_item_title": $scope.toDoItem.title,
            "todo_item_desc": $scope.toDoItem.desc,
            "todo_item_due_date": $scope.toDoItem.dueDate ? $filter('date')($scope.toDoItem.dueDate, "yyyy-MM-dd") : null,
            "todo_item_conditional_flg": $scope.toDoItem.condition ? true : false,
            "farm_id": "",
            "application_guid": $state.params.ID,
            "application_phase_guid": $scope.toDoItem.phaseDate ? $scope.toDoItem.phaseDate.application_phase_guid : null,
            "users": [],
            "roles": []
        };

        angular.forEach($scope.toDoItem.user, function (value, index) {
            var tempUser = {
                "auth_user_guid": value.guid,
                "salutation": value.salutation,
                "first_name": value.first_name,
                "last_name": value.last_name,
                "title": value.title,
                "organization": value.organization
            };
            postData.users.push(tempUser);
        });
        angular.forEach($scope.toDoItem.role, function (value, index) {
            var tempRole = {
                "auth_role_guid": value.guid,
                "auth_role_name": value.name
            };
            postData.roles.push(tempRole);
        });
        var failedCheck = false;

        if ($scope.toDoItem.desc == null || $scope.toDoItem.desc == undefined || $scope.toDoItem.desc == '') {
            failedCheck = true;
            $('#toDoItemDesc').closest('.form-group').addClass('has-error');
        } 
        
        if($scope.toDoItem.title == null || $scope.toDoItem.title == undefined || $scope.toDoItem.title == ''){
            failedCheck = true;
            $('#toDoItemTitle').closest('.form-group').addClass('has-error');
        } 
        
        if($scope.toDoItem.dueDate == null || $scope.toDoItem.dueDate == undefined || $scope.toDoItem.dueDate == ''){
            failedCheck = true;
            $('#toDoItemDueDate').closest('.form-group').addClass('has-error');
        } 
        
        if ($scope.toDoItem.condition == true && $scope.toDoItem.phaseDate == null) {
            failedCheck = true;
            $('#toDoItemCondition').closest('.form-group').addClass('has-error');
            toastr.clear();
            toastr.error('Please select Phase Details', 'Error posting Data');
        }
        
        if(failedCheck){
            toastr.clear();
            toastr.error('Please fill all Mandatory fields', 'Error posting Data');            
        }else {
            applicationService.addAppToDoItem(postData, $state.params.ID).then(
                    function (response) {
                        //$window.location.reload();
                        //console.log(response);

                        applicationService.fetchAppToDoList($state.params.ID).then(
                                function (response) {
                                    $rootScope.toDoItemsGridAll.data = response;
                                    //$scope.toDoItemslist = response;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Items List');
                                }
                        );
                        applicationService.fetchAppToDoListToMe($state.params.ID).then(
                                function (response) {
                                    $rootScope.toDoItemsGridToMe.data = response;
                                    //$scope.toDoItemslist = response;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Items List');
                                }
                        );
                        $uibModalInstance.close('save');
                    },
                    function (errResponse) {
                        toastr.clear();
                        toastr.error('Bad Connectivity / Server Error', 'Error while Adding ToDoItem');
                    }
            );
        }

    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('Cancel');
    };
}).controller('addUserToDoItemCtrl', function ($scope, $filter, $window, $uibModalInstance, applicationService, $state, userData) {
    //console.log(userData);
    $scope.usersGrid = {
        paginationPageSizes: false,
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: true,
        enableFullRowSelection: true,
        paginationPageSize: 25,
        columnDefs: [
            {name: 'first_name'},
            {name: 'last_name'},
            {name: 'title'},
            {name: 'organization'},
            {name: 'email_primary'},
            {name: 'phone_primary'}
        ]
    };

    $scope.usersGrid.onRegisterApi = function (gridApi) {
        $scope.gridApi2 = gridApi;
    };

    $scope.addUserDetails = function () {
        var selectedData = $scope.gridApi2.selection.getSelectedRows();

        angular.forEach(selectedData, function (value, index) {
            var tempUser = {
                "auth_user_guid": value.auth_user_guid,
                "salutation": value.salutation,
                "first_name": value.first_name,
                "last_name": value.last_name,
                "title": value.title,
                "organization": value.organization
            };
            userData.push(tempUser);
        });
        $uibModalInstance.dismiss('Cancel');
        //console.log(userData);
    };

    $scope.userCancel = function () {
        $uibModalInstance.dismiss('Cancel');
    };
    applicationService.fetchUsersList($state.params.ID).then(
            function (response) {
                //return response;
                $scope.usersGrid.data = response; //console.log(dataObj);
            },
            function (errResponse) {
                console.error('Error while fetching ToDo Item User List');
                return {};
            }
    );
}).controller('addRoleToDoItemCtrl', function ($scope, $filter, $window, $uibModalInstance, applicationService, $state, roleData) {

    $scope.rolesGrid = {
        paginationPageSizes: false,
        enableFiltering: true,
        enableRowSelection: true,
        multiSelect: true,
        enableFullRowSelection: true,
        paginationPageSize: 25,
        columnDefs: [
            {name: 'auth_role_name'},
            {name: 'description'},
            {name: 'tier_desc'},
            {name: 'tier_group_desc'},
            {name: 'tier_subgroup_desc'}
        ]
    };

    $scope.rolesGrid.onRegisterApi = function (gridApi) {
        $scope.gridApi2 = gridApi;
    };

    $scope.addRoleDetails = function () {
        var selectedData = $scope.gridApi2.selection.getSelectedRows();

        angular.forEach(selectedData, function (value, index) {
            var tempRole = {
                "auth_role_guid": value.auth_role_guid,
                "auth_role_name": value.auth_role_name
            };
            roleData.push(tempRole);
        });
        $uibModalInstance.dismiss('Cancel');
        //console.log(roleData);
    };

    $scope.roleCancel = function () {
        $uibModalInstance.dismiss('Cancel');
    };

    applicationService.fetchRolesList($state.params.ID).then(
            function (response) {
                //return response;
                $scope.rolesGrid.data = response; //console.log(response);
            },
            function (errResponse) {
//                return {};
                console.error('Error while fetching ToDo Item Roles List');
            }
    );
}).controller('loadToDoItemCtrl', function ($rootScope, $scope, $filter, $window, $uibModalInstance, applicationService, $state) {

    $scope.loadSelectedToDo = function () {
        //$rootScope.toDoItemsGridAll.data = $scope.loadToDo.todo_list_json;
        applicationService.addAppToDoItem($scope.loadToDo.todo_list_json, $state.params.ID).then(
                function (response) {
                    //$window.location.reload();
                    toastr.clear();
                    toastr.success('ToDo List loaded successfully');
                    applicationService.fetchAppToDoList($state.params.ID).then(
                            function (response) {
                                console.log(response);
                                $rootScope.toDoItemsGridAll.data = response;
                                //$scope.toDoItemslist = response;
                            },
                            function (errResponse) {
                                toastr.clear();
                                toastr.error('Bad Connectivity / Server Down', 'Error while fetching ToDo Items List');
                            }
                    );
                    //console.log(response);
                    $uibModalInstance.close('save');
                },
                function (errResponse) {
                    toastr.clear();
                    toastr.error('Bad Connectivity / Server Error', 'Error while loading ToDo Items');
                }
        );
        //console.log($scope.loadToDo.todo_list_json);
        $uibModalInstance.dismiss('Load');
    };

    applicationService.fetchLoadToDoList($state.params.ID).then(
            function (response) {
                //return response;
                $scope.loadToDoData = response; //console.log(response);
            },
            function (errResponse) {
                console.error('Error while fetching ToDo Item Roles List');
                return {};
            }
    );

    $scope.loadCancel = function () {
        $uibModalInstance.dismiss('Cancel');
    };
});