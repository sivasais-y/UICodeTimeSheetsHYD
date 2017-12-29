app.constant("baseURL", "/AG_SADCeFarms/")
        .constant("agSupportEmail", "efarmssupport@ag.nj.gov")
        .factory('applicationService', ['$http', 'baseURL', '$q', function ($http, baseURL, $q)
            {

                return {
                    fetchApplication: function (appID) {
                        return $http.get('lib/localScripts/appDashboard/updatedque.json')
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Application Data');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    submitApplication: function (formData) {
                        return $http.post(baseURL + 'appanswer', formData)
                                .then(
                                        function (response) {
                                            return response;
                                        },
                                        function (errResponse) {
                                            console.error('Error while Submitting Application Data');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchAppInfo: function (appID) {
                        return $http.get('lib/localScripts/appDashboard/appInfo.json')
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Application Info');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchAppToDoList: function (appID) {
                        return $http.get('lib/localScripts/appDashboard/todoList.json')
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Application ToDo List');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchAppToDoListToMe: function (appID) {
                        return $http.get('lib/localScripts/appDashboard/todoList2.json')
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Assigned ToDo List');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchAppToDoItem: function (toDoItemGUID) {
                        return $http.get('lib/localScripts/appDashboard/todoItem.json')
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Application ToDo Item Service');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    deleteAppToDoItem: function (toDoItemGUID) {
                        var url = baseURL + 'todo/' + toDoItemGUID;
                        return $http.delete(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while deleting ToDo Item');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    markAppToDoItem: function (toDoItemGUID) {
                        var markData = {
                            'todo_item_guid': toDoItemGUID
                        };
                        return $http.patch('', markData)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while marking ToDo Item as Completed');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    editAppToDoItem: function (putData, toDoItemGUID) {
                        console.log(putData);
                        var url = 'lib/localScripts/appDashboard/todoItem.json';
                        return $http.put(url, putData)
                                .then(
                                        function (response) {
                                            toastr.clear();
                                            toastr.success('ToDo Item data saved successfully', 'Success');
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            toastr.clear();
                                            toastr.error('Bad Connectivity / Server Error', 'Error while editing ToDoItem');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    addAppToDoItem: function (postData, appID) {
                        console.log(postData);
                        var url = baseURL + 'todo?application_id=' + appID; // replace with post url
                        return $http.post(url, postData)
                                .then(
                                        function (response) {
                                            toastr.clear();
                                            toastr.success('ToDo Item added successfully', 'Success');
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            toastr.clear();
                                            toastr.error('Bad Connectivity / Server Error', 'Error while Adding ToDoItem');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchRolesList: function (appID) {
                        var url = 'lib/localScripts/appDashboard/roles.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while adding ToDo Item');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchUsersList: function (appID) {
                        var url = 'lib/localScripts/appDashboard/users.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while adding ToDo Item');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchToDoPhaseDetails: function (appID) {
                        var url = 'lib/localScripts/appDashboard/toDoPhase.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching ToDo Phase Details');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchLoadToDoList: function (appID) {
                        var url = baseURL + 'todolist?application_id=' + appID;
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while Load ToDo Item');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    getNoteGroups: function (appId) {
                        return $http({
                            method: 'GET',
                            url: 'lib/localScripts/appNotesndDocs/get_note_group.json',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    postNoteGroup: function (appId, newNoteGroup) {
                        return $http({
                            method: 'POST',
                            url: 'http://127.0.0.1/AG_SADCeFarms/notegroup?application_id=' + appId,
                            data: newNoteGroup,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    updateNoteGroup: function (noteGroupId, noteGroup) {
                        return $http({
                            method: 'PUT',
                            url: 'http://127.0.0.1/AG_SADCeFarms/notegroup/' + noteGroupId,
                            data: noteGroup,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    deleteNoteGroup: function (noteGroupId) {
                        return $http({
                            method: 'DELETE',
                            url: 'http://127.0.0.1/AG_SADCeFarms/notegroup/' + noteGroupId,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    postNote: function (newNote) {
                        return $http({
                            method: 'POST',
                            url: 'http://127.0.0.1/AG_SADCeFarms/note',
                            data: newNote,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    updateNote: function (noteId, note) {
                        return $http({
                            method: 'PUT',
                            url: 'http://127.0.0.1/AG_SADCeFarms/notegroup/' + noteId,
                            data: note,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    deleteNote: function (noteId) {
                        return $http({
                            method: 'DELETE',
                            url: 'http://127.0.0.1/AG_SADCeFarms/notegroup/' + noteId,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    postNoteGroupTag: function (noteGroupTag) {
                        return $http({
                            method: 'POST',
                            url: 'http://127.0.0.1/AG_SADCeFarms' + 'notegrouptags',
                            data: noteGroupTag,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    getNoteGroupTags: function () {
                        return $http({
                            method: 'GET',
                            url: 'lib/localScripts/appNotesndDocs/get_tags.json',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },

                    deleteNoteGroupTag: function (deleteObj) {
                        return $http({
                            method: 'DELETE',
                            url: 'http://127.0.0.1/AG_SADCeFarms' + 'notegrouptags',
                            data: deleteObj,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })
                    },
                    fetchAppDocs: function (appID) {
                        var url = 'lib/localScripts/appDocs/getAppDocs.json'; //baseURL+'todolist?application_id='+ appID;
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Documents List');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    downloadDoc: function (docID) {
                        var url = baseURL + 'doc/' + docID;
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while downloading Document');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    deleteAppDoc: function (docID, appID) {
                        var url = baseURL + 'docs/' + docID;
                        var deleteData = {'application_id': appID};
                        return $http({
                            method: 'DELETE',
                            url: url,
                            data: deleteData,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(
                                function (response) {
                                    return response.data;
                                },
                                function (errResponse) {
                                    console.error('Error while Deleting Document');
                                    //return $q.reject(errResponse);
                                }
                        );

                    },
                    fetchUploadDocType: function (appID) {
                        var url = 'lib/localScripts/appDocs/getDocStatus.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Document Type Details');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchUploadDocStatus: function (appID) {
                        var url = 'lib/localScripts/appDocs/getDocType.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Document Status Details');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchUploadDocTags: function (appID) {
                        var url = 'lib/localScripts/appDocs/getDocTags.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Document Tags Details');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchUploadedDoc: function (appID, docGUID) {
                        var url = 'lib/localScripts/appDocs/getAppDocEdit.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching Document Details');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    uploadEditDocument: function (putData, docGUID) {
                        //console.log(putData, docGUID);
                        var url = 'http://localhost/AG_SADCeFarms/document/' + docGUID;
                        return $http.put(url, putData)
                                .then(
                                        function (response) {
                                            return response;
                                        },
                                        function (errResponse) {
                                            console.error('Error while Editing Document Details');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    uploadDocument: function (postData, appID) {
                        //console.log(postData);
                        var url = baseURL + 'doc?application_id=' + appID; // replace with post url
                        return $http.post(url, postData).then(
                                function (response) {
                                    toastr.clear();
                                    toastr.success('Document Uploaded successfully', 'Success');
                                    return response.data;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Error', 'Error while Uploading Document');
                                    //return $q.reject(errResponse);
                                }
                        );
                    },
                    fetchAppScores: function (appID) {
                        var url = 'lib/localScripts/appScores/getAppScore.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching App Scores');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    getAppScoreStatus: function (appID) {
                        var url = 'lib/localScripts/appScores/getAppScoreStatus.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching App Scores Status');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchAddScoreTypes: function (appID) {
                        var url = 'lib/localScripts/appScores/getAppScoreTypes.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching App Scores Types');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    getEditAppScore: function (appID) {
                        var url = 'lib/localScripts/appScores/getAppScoreEdit.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching App Scores');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    deleteAppScore: function (scoreID, appID) {
                        var url = baseURL + 'score/'+scoreID;
                        var deleteData = {'score_type_guid':scoreID,'application_id': appID};
                        return $http({
                            method: 'DELETE',
                            url: url,
                            data: deleteData,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(
                                function (response) {
                                    return response.data;
                                },
                                function (errResponse) {
                                    console.error('Error while Deleting Score');
                                    //return $q.reject(errResponse);
                                }
                        );

                    },
                    postAppScore: function (score, appID) {
                        var url = baseURL + 'score';
                        var postData = {'score_type_guid':score.score_type_guid,'application_id': appID};
                        return  $http.post(url, postData).then(
                                function (response) {
                                    toastr.clear();
                                    toastr.success('App Score Added successfully', 'Success');
                                    return response.data;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Error', 'Error while posting App Score');
                                    //return $q.reject(errResponse);
                                }
                        );

                    },
                    putAppScore: function (putData, appID, scoreGUID) {
                        var url = baseURL + 'score/'+scoreGUID;
                        return  $http.post(url, putData).then(
                                function (response) {
                                    toastr.clear();
                                    toastr.success('App Score Added successfully', 'Success');
                                    return response.data;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Error', 'Error while posting App Score');
                                    //return $q.reject(errResponse);
                                }
                        );

                    },
                    fetchAppContacts: function(appID){
                        var url = 'lib/localScripts/appContacts/getAppContacts.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching App Contacts');
                                            //return $q.reject(errResponse);
                                        }
                                );                       
                        
                    },
                    deleteAppContacts: function(contactGUID){
                        var url = baseURL + 'contacts';
                        var deleteData = {'application_contact_guid': contactGUID};
                        return $http({
                            method: 'DELETE',
                            url: url,
                            data: deleteData,
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(
                                function (response) {
                                    return response.data;
                                },
                                function (errResponse) {
                                    console.error('Error while Deleting App Contacts');
                                    //return $q.reject(errResponse);
                                }
                        );                        
                        
                    },
                    fetchAppContactsUsers: function () {
                        var url = 'lib/localScripts/appContacts/users.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching App Contacts users');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    fetchAppContactsTypes: function () {
                        var url = 'lib/localScripts/appContacts/GetAppContactType.json';
                        return $http.get(url)
                                .then(
                                        function (response) {
                                            return response.data;
                                        },
                                        function (errResponse) {
                                            console.error('Error while fetching App Contacts Types');
                                            //return $q.reject(errResponse);
                                        }
                                );
                    },
                    postAppNewContact: function (postData) {
                        var url = baseURL + 'appcontact';
                        
                        return  $http.post(url, postData).then(
                                function (response) {
                                    toastr.clear();
                                    toastr.success('App Contact Added successfully', 'Success');
                                    return response.data;
                                },
                                function (errResponse) {
                                    toastr.clear();
                                    toastr.error('Bad Connectivity / Server Error', 'Error while posting App Contact');
                                    //return $q.reject(errResponse);
                                }
                        );

                    },
                    checkAppID: function (appID) {
                        console.log(appID);
                        //if (appID != '' && appID != null && appID != undefined) {
                            return true;
                        //} else {
                            return false;
                        //}

                    }
                };
            }]);
