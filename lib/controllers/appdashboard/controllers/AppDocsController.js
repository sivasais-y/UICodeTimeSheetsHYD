(function () {
    'use strict';
}());
app.controller('AppDocsController', ['$scope', '$state', '$log', 'applicationService', '$sce', '$http', '$window', 'modalService', 'modalMessageService', '$uibModal', '$rootScope', function ($scope, $state, $log, applicationService, $sce, $http, $window, modalService, modalMessageService, $uibModal, $rootScope) {
                
//                $scope.ui_components = {
//                    'ui_search_auth': false
//
//                };
//
//                var disable_ui_components = function () {
//                    $scope.ui_components['ui_search_auth'] = false;
//                };
//                var setUIValues = function () {
//                    var ui_access = AuthService.authResponse.ui_access;
//                    angular.forEach(ui_access, function (comp_key) {
//                        if ($scope.ui_components.hasOwnProperty(comp_key)) {
//                            $scope.ui_components[comp_key] = true;
//                        }
//                    });
//                };
//
////AuthService
//                if (AuthService.isAuthenticated()) {
//                    console.log("++++++User is authenticated");
//                    console.log("++++++Users ui access:", AuthService.getUserUIAccess());
//                    setUIValues();
//
//                } else {
//                    console.log("++++++User is not authenticated");
//                    disable_ui_components();
//                }
//
//                $scope.$watchCollection(function () {
//                    return AuthService.authState;
//                }, function () {
//                    if (!AuthService.authState) {
//                        $log.debug("+++AuthService.authState changed to:", AuthService.authState);
//                        disable_ui_components();
//
//                    } else {
//                        setUIValues();
//                    }
//                });
                        
                $rootScope.getAppDocs = function () {
                    applicationService.fetchAppDocs($state.params.ID).then(
                            function (response) {
                                $scope.appDocsData = response;

                            },
                            function (errResponse) {
                                toastr.clear();
                                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Documents List');
                            }
                    );
                };

                applicationService.fetchUploadDocTags($state.params.ID).then(
                        function (response) {
                            //return response;
                            $scope.docTagsList = response; //console.log($scope.docTagsList);
                        },
                        function (errResponse) {
                            toastr.clear();
                            toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Status Details');
                            return {};
                        }
                );

                var checkID = applicationService.checkAppID($state.params.ID);

                if (checkID) {
                    $rootScope.getAppDocs();

                    $scope.modelOptions = {
                        debounce: {
                            default: 500,
                            blur: 250
                        },
                        getterSetter: true
                    };

                    $scope.uploadFile = function () {
                        var modalInstance = $uibModal.open({
                            templateUrl: 'views/application/appUploadDoc.html',
                            controller: 'uploadDocCtrl',
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

                    $scope.editDoc = function (e, docGUID) {

                        var modalInstance = $uibModal.open({
                            templateUrl: 'views/application/appEditUploadedDoc.html',
                            controller: 'editDocCtrl',
                            size: 'md',
                            backdrop: 'static',
                            resolve: {
                                docGUIDObj: function () {
                                    return docGUID;
                                }
                            }
                        });

                        modalInstance.result.then(function (selectedItem) {
                            //$scope.selected = selectedItem;
                        }, function () {
                            console.log('Modal dismissed at: ' + new Date());
                        });

                    };


                    $scope.downloadDoc = function (docGUID, docName) {
                        $window.open('/AG_SADCeFarms/doc/'+docGUID);
                    };

                    $scope.deleteDoc = function (e, delDocGUID) {
                        var modalOptions = {
                            closeButtonText: 'No',
                            actionButtonText: 'Yes',
                            headerText: 'Warning',
                            bodyText: 'Are you sure you want to delete this Document?'
                        };
                        modalService.showModal({}, modalOptions)
                                .then(function (result) {
                                    applicationService.deleteAppDoc(delDocGUID, $state.params.ID).then(
                                            function (response) {
                                                //$window.location.reload();
                                                $rootScope.getAppDocs();
                                                modalMessageService.showMessage("Success:", "Document deleted Successfully");
                                                //console.log(response);
                                                //$uibModalInstance.close('Delete');
                                            },
                                            function (errResponse) {
                                                toastr.clear();
                                                toastr.error('Bad Connectivity / Server Down', 'Error while deleting Document');
                                            }
                                    );
                                });
                    };

                } else {
                    $scope.IDfailed = true;
                }

            }])
    .controller('uploadDocCtrl', function ($scope, $rootScope, $uibModal, $filter, $window, $uibModalInstance, applicationService, $state) {

    applicationService.fetchUploadDocType($state.params.ID).then(
            function (response) {
                //return response;
                $scope.docTypeList = response; //console.log(dataObj);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Type Details');
                return {};
            }
    );

    applicationService.fetchUploadDocStatus($state.params.ID).then(
            function (response) {
                //return response;
                $scope.docStatusList = response; //console.log(dataObj);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Status Details');
                return {};
            }
    );

    applicationService.fetchUploadDocTags($state.params.ID).then(
            function (response) {
                //return response;
                $scope.docTagsList = response; //console.log($scope.docTagsList);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Status Details');
                return {};
            }
    );

    $scope.selectedTags = [];
    $scope.activeTags = [];

    $scope.includeTag = function (e) {
        if ($scope.selectedTags.indexOf($scope.uploadDoc.documentTag) < 0) {
            $scope.selectedTags.push($scope.uploadDoc.documentTag);
        }
        //console.log($scope.uploadDoc.documentTag);
    };

    $scope.activateTags = function (val, e) {
        if ($scope.activeTags.indexOf(val) < 0) {
            $scope.activeTags.push(val);
        } else {
            $scope.activeTags.splice(val, 1);
        }

        $(e.target).toggleClass('activeTag');
    };

    $scope.excludeTags = function () {
        $.each($scope.activeTags, function (index, value) {
            if ($scope.selectedTags.indexOf(value) >= 0) {
                $scope.selectedTags.splice($scope.selectedTags.indexOf(value), 1);
            }
        });
        
        if($scope.activeTags.length <= 0){
            toastr.clear();
            toastr.info('Please select atleast one tag', 'Info');            
        }
    };

    $scope.uploadDocument = function () {
//        var tagsData = [];
//        $.each($scope.selectedTags, function (index, value) {
//            tagsData.push({'doc_tag_desc':value});
//        });
//        var postData = {
//            "document_type_desc": $scope.uploadDoc.docType,
//            "document_status_desc": $scope.uploadDoc.docStatus,
//            "public_access_flg": $scope.uploadDoc.public ? 1 : 0,
//            tags:  $scope.selectedTags,
//            "file": document.getElementById('appUploadDoc').files[0]
//        };

        var formData = new FormData();
        formData.append('document_type_desc', $scope.uploadDoc.docType);
        formData.append('document_status_desc', $scope.uploadDoc.docStatus);
        formData.append('public_access_flg', $scope.uploadDoc.public ? 1 : 0);
        formData.append('file', document.getElementById('appUploadDoc').files[0]);
        formData.append('tags', JSON.stringify($scope.selectedTags));
        
        var failedCheck = false;

//        $.each($scope.selectedTags, function (index, value) {
//            postData.tags = value;
//        });

//        console.log(document.getElementById('appUploadDoc').files[0]);

        if ($scope.uploadDoc.docStatus == null || $scope.uploadDoc.docStatus == undefined || $scope.uploadDoc.docStatus == '') {
            failedCheck = true;
            $('#appUploadDocStatus').closest('.form-group').addClass('has-error');
        }
        if( $scope.uploadDoc.docType == null || $scope.uploadDoc.docType == undefined || $scope.uploadDoc.docType == '' ){
            failedCheck = true;
            $('#appUploadDocType').closest('.form-group').addClass('has-error');           
        }
        if(document.getElementById('appUploadDoc').files.length <= 0){
            failedCheck = true;
            $('#appUploadDoc').closest('.form-group').addClass('has-error');
        }
        
        if(!failedCheck){
            applicationService.uploadDocument(formData, $state.params.ID).then(
                    function (response) {
                        //$window.location.reload();
//                        console.log(response);
                        $rootScope.getAppDocs();
                        $uibModalInstance.close('save');
                    },
                    function (errResponse) {
                        toastr.clear();
                        toastr.error('Bad Connectivity / Server Error', 'Error while Uploading Document');
                    }
            );
        }else{
            toastr.clear();
            toastr.error('Please fill all mandatory fields', 'Error Uploading Document');            
        }

    };

    $scope.uploadCancel = function () {
        $uibModalInstance.dismiss('Cancel');
    };

})
    .controller('editDocCtrl', function (docGUIDObj, $scope, $rootScope, $uibModal, $filter, $window, $uibModalInstance, applicationService, $state) {

    applicationService.fetchUploadDocType($state.params.ID).then(
            function (response) {
                //return response;
                $scope.docTypeList = response; //console.log(dataObj);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Type Details');
                return {};
            }
    );

    applicationService.fetchUploadDocStatus($state.params.ID).then(
            function (response) {
                //return response;
                $scope.docStatusList = response; //console.log(dataObj);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Status Details');
                return {};
            }
    );

    applicationService.fetchUploadDocTags($state.params.ID).then(
            function (response) {
                //return response;
                $scope.docTagsList = response; //console.log($scope.docTagsList);
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Status Details');
                return {};
            }
    );

    $scope.selectedTags = [];
    $scope.activeTags = [];

    applicationService.fetchUploadedDoc($state.params.ID, docGUIDObj).then(
            function (response) {
                //return response;
                $scope.appDocData = response;

                $.each($scope.appDocData.tags, function (index, value) {
                    if ($scope.selectedTags.indexOf(value.doc_tag_desc) < 0) {
                        $scope.selectedTags.push(value.doc_tag_desc);
                    }
                });
            },
            function (errResponse) {
                toastr.clear();
                toastr.error('Bad Connectivity / Server Down', 'Error while fetching Document Type Details');
                return {};
            }
    );

    $scope.includeTag = function (e) {
        if ($scope.selectedTags.indexOf($scope.appDocData.documentTag) < 0) {
            $scope.selectedTags.push($scope.appDocData.documentTag);
        }
        //console.log($scope.uploadDoc.documentTag);
    };

    $scope.activateTags = function (val, e) {
        if ($scope.activeTags.indexOf(val) < 0) {
            $scope.activeTags.push(val);
        } else {
            $scope.activeTags.splice(val, 1);
        }

        $(e.target).toggleClass('activeTag');
    };

    $scope.excludeTags = function () {
        $.each($scope.activeTags, function (index, value) {
            if ($scope.selectedTags.indexOf(value) >= 0) {
                $scope.selectedTags.splice($scope.selectedTags.indexOf(value), 1);
            }
        });
        
        if($scope.activeTags.length <= 0){
            toastr.clear();
            toastr.info('Please select atleast one tag', 'Info');            
        }
    };

    $scope.uploadEditDoc = function () {
        var tagsData = [];
        $.each($scope.selectedTags, function (index, value) {
            tagsData.push({'doc_tag_desc': value});
        });
        var putData = {
            "document_type_desc": $scope.appDocData.document_type_desc,
            "document_status_desc": $scope.appDocData.document_status_desc,
            "document_name": $scope.appDocData.document_name,
            "public_access_flg": $scope.appDocData.public_access_flg ? true : false,
            "active_flg": $scope.appDocData.active_flg ? true : false,
            "tags": tagsData
        };
        var failedCheck = false;
        
        if ($scope.appDocData.document_status_desc == null || $scope.appDocData.document_status_desc == undefined || $scope.appDocData.document_status_desc == '') {
            failedCheck = true;
            $('#appEditingDocStatus').closest('.form-group').addClass('has-error');
        }
        if($scope.appDocData.document_type_desc == null || $scope.appDocData.document_type_desc == undefined || $scope.appDocData.document_type_desc == ''){
            failedCheck = true;
            $('#appEditingDocType').closest('.form-group').addClass('has-error');           
        }
        if($scope.appDocData.document_name == null || $scope.appDocData.document_name == undefined || $scope.appDocData.document_name == ''){
            failedCheck = true;
            $('#appEditingDocName').closest('.form-group').addClass('has-error');
        }
        
        if(!failedCheck){            
            applicationService.uploadEditDocument(putData, $scope.appDocData.document_guid).then(
                    function (response) {
                        //$window.location.reload();
                        //console.log(response);
                        $rootScope.getAppDocs();
                        $uibModalInstance.close('save');
                    },
                    function (errResponse) {
                        toastr.clear();
                        toastr.error('Bad Connectivity / Server Error', 'Error while Editing ToDoItem');
                    }
            );
        }else{
            toastr.clear();
            toastr.error('Please fill all mandatory fields', 'Error Uploading Document');            
        }

    };

    $scope.uploadCancel = function () {
        $uibModalInstance.dismiss('Cancel');
    };

});