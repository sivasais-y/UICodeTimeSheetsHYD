app.constant('errorImageURL', '../app/images/error-404.png')
.controller('AppNotesController', ['$scope', 'applicationService', '$stateParams', '$log',
            'errorImageURL', '$state', '$uibModal', 'modalMessageService', 'modalService', '$filter', function ($scope, applicationService, $stateParams, $log, errorImageURL, $state, $uibModal, modalMessageService, modalService, $filter) {
                var appNtndDc = this;

                var onLoad = function () {
                    appNtndDc.showErrorMessage = false;
                    appNtndDc.errorImageURL = errorImageURL;
                    appNtndDc.refreshNoteGroups();
                    appNtndDc.notesAccordionOpenCloseStatus = false;
                    appNtndDc.notesSortByOption = {};
                    $scope.searchNoteGroup = 1;
                    applicationService.getNoteGroupTags().then(function (resp) {
                        if (resp.status == 200) {
                            appNtndDc.allAvailalbeTags = resp.data;
                        } else {
                            console.log(resp);
                            toastr.error('Error occured while fectching tags');
                        }
                    }, function () {
                        if (resp.status == 200) {
                            appNtndDc.allAvailalbeTags = resp.data;
                        } else {
                            console.log(resp);
                            toastr.error('Error occured while fectching tags');
                        }
                    });
                };
                $scope.onTagSelected = function (tag) {
                    if (tag) {
                        $scope.searchNoteGroup = {'tags': []};
                        $scope.searchNoteGroup['tags']['tag_desc'] = tag.tag_desc;
                    } else {
                        $scope.searchNoteGroup = 1;
                    }

                };

                $scope.modelOptions = {
                    debounce: {
                        default: 500,
                        blur: 250
                    },
                    getterSetter: true
                };

                appNtndDc.getappId = function () {
                    return $state.params.ID;
                };

                appNtndDc.refreshNoteGroups = function () {
                    applicationService.getNoteGroups(appNtndDc.getappId()).then(
                            function (result) {
                                appNtndDc.noteGroups = result.data;
                                appNtndDc.notesAccordionArray = [];
                                for (var i = 0; i < result.data.length; i++) {
                                    appNtndDc.notesAccordionArray.push(false);
                                }
                            }, function (res) {
                        console.log(res);
                        toastr.error('error occured while fetching note groups');
                    }
                    );
                };

                appNtndDc.addNewNoteGroup = function ($event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    var newNoteGroup = {
                        note_group_title: '',
                        sadc_flg: false,
                        notes: [],
                        tags: []
                    };
                    upsertNoteGroup(newNoteGroup, true);
                };

                appNtndDc.editNoteGroup = function ($event, $index) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    upsertNoteGroup(appNtndDc.noteGroups[$index], false);
                };

                var upsertNoteGroup = function (noteGroup, isNewNoteGroup) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        static: true,
                        templateUrl: 'views/application/appNotesAndDocuments/upsert_note_group.html',
                        backdrop: 'static',
                        controller: 'appUpsertNoteGroupModalCtrl',
                        controllerAs: 'appUNGMC',
                        resolve: {
                            resolvedObj: function () {
                                var obj = {
                                    noteGroup: angular.copy(noteGroup),
                                    appId: appNtndDc.getappId(),
                                    isNewNoteGroup: isNewNoteGroup
                                };
                                return obj;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        appNtndDc.refreshNoteGroups();
                    }, function () {

                    });
                };

                appNtndDc.addNewNote = function ($event, noteGroupId) {
                    $event.preventDefault();
                    $event.stopPropagation();

                    var modalInstance = $uibModal.open({
                        animation: true,
                        static: true,
                        templateUrl: 'views/application/appNotesAndDocuments/upsert_note.html',
                        backdrop: 'static',
                        controller: 'appUpsertNoteModalCtrl',
                        controllerAs: 'appUNMCTRL',
                        size: 'md',
                        resolve: {
                            noteObj: function () {
                                var newNote = {
                                    note_group_guid: noteGroupId,
                                    note_text: ''
                                };
                                return newNote;
                            }
                        }
                    });
                    modalInstance.result.then(function () {
                        appNtndDc.refreshNoteGroups();
                    }, function () {
                    });
                };

                appNtndDc.addNewDocument = function () {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        static: true,
                        templateUrl: 'views/application/appNotesAndDocuments/upload_file.html',
                        backdrop: 'static',
                        size: 'md',
                        controller: ['$uibModalInstance', function ($uibModalInstance) {
                                var ANDMCTRL = this;
                                ANDMCTRL.cancel = function () {
                                    $uibModalInstance.dismiss();
                                };
                            }],
                        controllerAs: 'ANDMCTRL'
                    });

                    modalInstance.result.then(function () {
                        appNtndDc.refreshDocuments();
                    }, function () {

                    });
                };

                appNtndDc.noteGroupsSortBy = function () {
                    if (appNtndDc.noteGroupsSortByOption == 'old') {
                        appNtndDc.noteGroups = $filter('orderBy')(appNtndDc.noteGroups, 'last_edited_date');
                        var noteGroupsLen = appNtndDc.noteGroups.length;
                        for (var i = 0; i < noteGroupsLen; i++) {
                            appNtndDc.noteGroups[i].notes = $filter('orderBy')(appNtndDc.noteGroups[i].notes, 'last_edited_date');
                        }
                    } else {
                        appNtndDc.noteGroups = $filter('orderBy')(appNtndDc.noteGroups, '-last_edited_date');
                        var noteGroupsLens = appNtndDc.noteGroups.length;
                        for (var j = 0; j < noteGroupsLens; j++) {
                            appNtndDc.noteGroups[j].notes = $filter('orderBy')(appNtndDc.noteGroups[j].notes, '-last_edited_date');
                        }
                    }
                };

                appNtndDc.notesSortBy = function (i, bool) {
                    if (bool == 'old') {
                        appNtndDc.noteGroups[i].notes = $filter('orderBy')(appNtndDc.noteGroups[i].notes, 'last_edited_date');
                    } else {
                        appNtndDc.noteGroups[i].notes = $filter('orderBy')(appNtndDc.noteGroups[i].notes, '-last_edited_date');
                    }
                };

                appNtndDc.deleteNoteGroup = function ($event, noteGroupId) {
                    var modalOptions = {
                        closeButtonText: 'No',
                        actionButtonText: 'Yes',
                        headerText: 'Warning',
                        bodyText: 'Are you sure you want to delete this item?'
                    };
                    modalService.showModal({}, modalOptions)
                            .then(function (result) {
                                $event.preventDefault();
                                $event.stopPropagation();
                                applicationService.deleteNoteGroup(noteGroupId).then(function () {
                                    toastr.success('Note Group Deleted');
                                    appNtndDc.refreshNoteGroups();
                                }, function (res) {
                                    console.log(res);
                                    toastr.error('error occured while delete noteGroup');
                                });
                            });
                };

                onLoad();
            }])

        .directive('drAppNote', [function () {
                return{
                    restrict: 'E',
                    scope: {
                        note: '=',
                        refreshFn: '&',
                        sadcFlg: '='
                    },
                    bindToController: true,
                    templateUrl: 'views/application/appNotesAndDocuments/drAppNote.html',
                    controllerAs: 'appNDCTRL',
                    controller: ['$uibModal', 'applicationService', '$q', 'modalMessageService', 'modalService', function ($uibModal, applicationService, $q, modalMessageService, modalService) {
                            var appNDCTRL = this;

                            appNDCTRL.deleteNote = function () {
                                var modalOptions = {
                                    closeButtonText: 'No',
                                    actionButtonText: 'Yes',
                                    headerText: 'Warning',
                                    bodyText: 'Are you sure you want to delete this item?'
                                };
                                modalService.showModal({}, modalOptions)
                                        .then(function (result) {
                                            applicationService.deleteNote(appNDCTRL.note.note_guid).then(function () {
                                                toastr.success('Note Deleted');
                                                appNDCTRL.refreshFn();
                                            }, function (res) {
                                                console.log(res);
                                                toastr.error('error occured while deleting note');
                                            });
                                        });
                            };

                            appNDCTRL.saveNoteText = function (data) {
                                var d = $q.defer();
                                var noteObj = angular.copy(appNDCTRL.note);
                                noteObj.note_text = data;
                                applicationService.updateNote(appNDCTRL.note.note_guid, noteObj).then(function (resp) {
                                    if (resp.status == 200) {
//                    NDCTRL.note.note_text = noteObj.note_text;
                                        d.resolve();
                                        toastr.success('New Notes Group created');
                                    } else {
                                        d.resolve(resp);
                                    }
                                }, function (resp) {
                                    console.log(resp);
                                    d.resolve(resp);
                                    toastr.error('some error occured while Updating note group');
                                });
                                return d.promise;
                            };

                            appNDCTRL.editNote = function () {
                                var modalInstance = $uibModal.open({
                                    animation: true,
                                    size: 'md',
                                    static: true,
                                    templateUrl: 'views/application/appNotesAndDocuments/upsert_note.html',
                                    backdrop: 'static',
                                    controller: 'appUpsertNoteModalCtrl',
                                    controllerAs: 'appUNMCTRL',
                                    resolve: {
                                        noteObj: function () {
                                            return appNDCTRL.note;
                                        }
                                    }
                                });

                                modalInstance.result.then(function () {
                                    appNDCTRL.refreshFn();
                                }, function () {

                                });
                            };
                            
                            appNDCTRL.downloadPDFNote = function (noteID) {
                                //console.log('Print This --', noteID);
                                var targetNotes = $('#note-'+noteID).html().trim();
                                
                                var doc = new jsPDF();
                                var splitTitle = doc.splitTextToSize(targetNotes, 180);
                                doc.text(splitTitle, 10, 10);
                                doc.save('PDFnote-'+noteID+'.pdf');
                            };


                        }]

                };
            }])

        .controller('appUpsertNoteModalCtrl', ['$scope', '$uibModalInstance', 'noteObj', 'applicationService',
            function ($scope, $uibModalInstance, note, applicationService) {
                var appUNMCTRL = this;

                var onLoad = function () {
                    appUNMCTRL.note = note;
                    appUNMCTRL.submitted = false;
                };

                appUNMCTRL.save = function () {
                    if (!$scope.upsertNoteForm.$invalid) {
                        if (!appUNMCTRL.note.note_guid) {
                            applicationService.postNote(appUNMCTRL.note).then(function () {
                                toastr.success('New Note created');
                                $uibModalInstance.close();
                            }, function (resp) {
                                console.log(resp);
                                toastr.error('some error occured while saving note group');
                            });
                        } else {
                            applicationService.updateNote(appUNMCTRL.note.note_guid, appUNMCTRL.note).then(function () {
                                toastr.success('New Notes Group created');
                                $uibModalInstance.close();
                            }, function (resp) {
                                console.log(resp);
                                toastr.error('some error occured while Updating note group');
                            });
                        }
                    } else {
                        appUNMCTRL.submitted = true;
                        toastr.warning('Fill all the required fields');
                    }
                };
                appUNMCTRL.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                onLoad();
            }])

        .controller('appUpsertNoteGroupModalCtrl', ['$scope', '$uibModalInstance', 'resolvedObj', 'applicationService', '$uibModal', 'modalMessageService', 'modalService',
            function ($scope, $uibModalInstance, resolvedObj, applicationService, $uibModal, modalMessageService, modalService) {
                var appUNGMC = this;

                var onLoad = function () {
                    appUNGMC.noteGroup = resolvedObj.noteGroup;
                    appUNGMC.submitted = false;
                    appUNGMC.isNewNoteGroup = resolvedObj.isNewNoteGroup;
                    applicationService.getNoteGroupTags().then(function (resp) {
                        if (resp.status == 200) {
                            appUNGMC.allAvailalbeTags = resp.data;
                        } else {
                            console.log(resp);
                            toastr.error('Error occured while fectching tags');
                        }
                    }, function () {
                        if (resp.status == 200) {
                            appUNGMC.allAvailalbeTags = resp.data;
                        } else {
                            console.log(resp);
                            toastr.error('Error occured while fectching tags');
                        }
                    });
                };
                appUNGMC.addNoteGroupTag = function () {
                    if (appUNGMC.selectedTag.length > 0 && !isExistsInAlreadySelectedTags()) {
                        $scope.tagsError = false;
                        appUNGMC.noteGroup.tags.push({"tag_desc": appUNGMC.selectedTag});
                    }
                };

                var isExistsInAlreadySelectedTags = function () {
                    for (var i = 0; i < appUNGMC.noteGroup.tags.length; i++) {
                        if (appUNGMC.noteGroup.tags[i].tag_desc == appUNGMC.selectedTag) {
                            return true;
                        }
                    }
                    return false;
                };

                appUNGMC.deleteNoteGroupTag = function (index) {
                    appUNGMC.noteGroup.tags.splice(index, 1);
                    toastr.success('Removed tag');
                };

                appUNGMC.permissions = [
                    {key: true, value: 'SADC staff'},
                    {key: false, value: 'Public'}
                ];
                
                $scope.tagsError = false;

                appUNGMC.save = function () {
                    if (!$scope.upsertNoteGroupForm.$invalid && appUNGMC.noteGroup.tags.length > 0) {
                        if (!appUNGMC.noteGroup.note_group_guid) {
                            var note = appUNGMC.noteGroup.note_text;
                            appUNGMC.noteGroup.notes = [
                                {
                                    "note_text": note
                                }
                            ];
                            applicationService.postNoteGroup(resolvedObj.appId, appUNGMC.noteGroup).then(function () {
                                toastr.success('New Notes Group created');
                                $uibModalInstance.close();
                            }, function (resp) {
                                console.log(resp);
                                toastr.error('some error occured while saving note group');
                            });
                        } else {
                            applicationService.updateNoteGroup(appUNGMC.noteGroup.note_group_guid, appUNGMC.noteGroup).then(function () {
                                toastr.success(' Notes Group updated');
                                $uibModalInstance.close();
                            }, function (resp) {
                                console.log(resp);
                                toastr.error('some error occured while updatind note group');
                            });
                        }
                    } else {
                        appUNGMC.submitted = true;
                        toastr.warning('Fill all the required fields');
                        $scope.tagsError = true;
                    }
                };
                appUNGMC.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                onLoad();
            }]);
















