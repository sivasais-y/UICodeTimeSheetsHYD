
app.controller('AppEditTimeSheetController', function ($scope, $rootScope, $state, $http, $window, $filter) {

    console.log($state.params.id);
    var timesheetDetail = 'lib/localScripts/timesheets/history_details.json';

    $http({
        method: "GET",
        url: timesheetDetail,
        headers: {
            'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
            'authorization': $window.sessionStorage.getItem("AuthKey")
        }
    }).then(function mySucces(response) {
        if (response != 'undefiend' && response != "") {
            $scope.timeSheetDetails = response.data;

            $scope.employeeid = $scope.timeSheetDetails.employeeId;
            $scope.employeename = $scope.timeSheetDetails.employeeName;
            $scope.employeeType = 'EMP Type';
            $scope.employeedesignation = $scope.timeSheetDetails.employeeDesignation;
            $scope.employeedepartment = 'EMP Department';

            $scope.dtPopup = new Date($scope.timeSheetDetails.startDateOfWeek);
            $scope.dtPopup1 = new Date($scope.timeSheetDetails.endDateOfWeek);

            $scope.weeksdetails = "selected week as " + $filter('date')($scope.dtPopup, "dd-MMM-yyyy")
                    + "  to  " + $filter('date')($scope.dtPopup1, "dd-MMM-yyyy");

            $scope.tasks = [];
            $scope.projects = [];

            var count = 1;
            var employeeid = $window.sessionStorage.getItem("EmployeeId");

            var employeeDetails = 'lib/localScripts/timesheets/employeedetails.json';
            var customeDetails = 'lib/localScripts/timesheets/customer.json';
            var departments = 'lib/localScripts/timesheets/department.json';

            var allcpc = 'lib/localScripts/timesheets/customerprogramcode.json';

            function getProjects(deptId, customerId, rowNumb) {

                var allproject = 'lib/localScripts/timesheets/project.json';
                $http({
                    method: "GET",
                    url: allproject,
                    headers: {
                        'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                        'authorization': $window.sessionStorage.getItem("AuthKey")
                    }
                }).then(function mySucces(response) {
                    $scope.projects[rowNumb] = response.data;
                }, function myError(response) {
                    $('#loading-bar').remove();
                    $('#loading-bar-spinner').remove();
                });
            }

            function getTasks(deptId, customerId, rowNumb) {
                var taskdata = 'lib/localScripts/timesheets/tasks.json';
                $http({
                    method: "GET",
                    url: taskdata,
                    headers: {
                        'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                        'authorization': $window.sessionStorage.getItem("AuthKey")
                    }
                }).then(function mySucces(response) {
                    $scope.tasks[rowNumb] = response.data;
                }, function myError(response) {
                    $('#loading-bar').remove();
                    $('#loading-bar-spinner').remove();
                });
            }

            $scope.fillProject = function (task, divindex) {

                var customer = task[divindex].customer;
                var department = task[divindex].department;

                if (customer && department) {
                    var allproject = 'lib/localScripts/timesheets/project.json';
                    $http({
                        method: "GET",
                        url: allproject,
                        headers: {
                            'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                            'authorization': $window.sessionStorage.getItem("AuthKey")
                        }
                    }).then(function mySucces(response) {
                        $scope.projects[divindex] = response.data;
                        if ($scope.projects[divindex].length == 0) {
                            swal('error',
                                    'No project mapped with current selection',
                                    'error')
                        }
                    }, function myError(response) {
                        $('#loading-bar').remove();
                        $('#loading-bar-spinner').remove();
                        console.log(response);
                    });
                    var taskdata = 'lib/localScripts/timesheets/tasks.json';
                    $http({
                        method: "GET",
                        url: taskdata,
                        headers: {
                            'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                            'authorization': $window.sessionStorage.getItem("AuthKey")
                        }
                    }).then(function mySucces(response) {
                        $scope.tasks[divindex] = response.data;
                        if ($scope.tasks[divindex].length == 0) {
                            swal('error', 'No Task mapped with current selection', 'error')
                        }
                    }, function myError(response) {
                        $('#loading-bar').remove();
                        $('#loading-bar-spinner').remove();
                    });
                }

            };

            $http({
                method: "GET",
                url: employeeDetails,
                headers: {
                    'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                    'authorization': $window.sessionStorage.getItem("AuthKey")
                }
            }).then(function mySucces(response) {

                if (response != 'undefiend' && response != "") {
                    $scope.employeeid = response.data.employeeId;
                    $scope.employeename = response.data.firstName + ' ' + response.data.lastName;
                    $scope.employeedesignation = response.data.designation;
                    $scope.employeelocation = response.data.address;
                    $scope.employeeType = response.data.employeeType;
                    $scope.employeedepartment = response.data.department.departmentName;
                    $scope.employeedepartmentId = response.data.department.departmentId;
                    $scope.employeeemail = response.data.emailId;

                }
            }, function myError(response) {
                $('#loading-bar').remove();
                $('#loading-bar-spinner').remove();
            });

            $http({
                method: "GET",
                url: customeDetails,
                headers: {
                    'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                    'authorization': $window.sessionStorage.getItem("AuthKey")
                }
            }).then(function mySucces(response) {
                $scope.customers = response.data;
            }, function myError(response) {
                $('#loading-bar').remove();
                $('#loading-bar-spinner').remove();
            });

            $http({
                method: "GET",
                url: departments,
                headers: {
                    'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                    'authorization': $window.sessionStorage.getItem("AuthKey")
                }
            }).then(function mySucces(response) {
                $scope.departments = response.data;
            }, function myError(response) {
                $('#loading-bar').remove();
                $('#loading-bar-spinner').remove();
            });

            $http({
                method: "GET",
                url: allcpc,
                headers: {
                    'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                    'authorization': $window.sessionStorage.getItem("AuthKey")
                }
            }).then(function mySucces(response) {
                $scope.cpcs = response.data;
            }, function myError(response) {
                $('#loading-bar').remove();
                $('#loading-bar-spinner').remove();
            });

            $scope.divIterator = [];
            $scope.task = [];
            $scope.weekdays = {};
            $scope.weekDays = {};
            $scope.weekDaysHR = {
                "dates": {},
                'totalHours': 0
            };
            $scope.daydetails = [];
            $scope.ids = [];
            $scope.colTotals = [];
            $scope.rowTotals = [];

            $scope.dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            if ($scope.timeSheetDetails && $scope.timeSheetDetails.startDateOfWeek && $scope.timeSheetDetails.endDateOfWeek) {
                var weekStart = new Date($scope.timeSheetDetails.startDateOfWeek);

                for (var i = 0; i <= 6; i++) {
                    var weekKey = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);                //weekKey.setDate(weekStart.getDate()+i);

                    var weekDate = weekKey.getDate() < 10 ? '0' + weekKey.getDate() : weekKey.getDate();
                    var weekMonth = weekKey.getMonth() + 1 < 10 ? '0' + parseInt(weekKey.getMonth() + 1) : weekKey.getMonth() + 1;
                    var weekYear = weekKey.getFullYear();

                    $scope.weekDays[weekDate + '-' + weekMonth + '-' + weekYear] = {
                        date: weekDate,
                        day: $scope.dayName[weekKey.getDay()]
                    };

                    $scope.weekdays[weekDate + '-' + weekMonth + '-' + weekYear] = {
                        date: weekDate + '-' + weekMonth + '-' + weekYear,
                        day: weekDate + '(' + $scope.dayName[weekKey.getDay()] + ')'
                    };
                }
            }


            $.each($scope.timeSheetDetails.timesheets, function (index, value) {
                $scope.divIterator.push(count);
                $scope.task.push(count);
                $scope.daydetails.push(count);
                $scope.daydetails[count - 1] = {};
                $scope.ids.push(count);
                $.each(value, function (taskKey, taskValue) {
                    var taskDetails = {
                        "customer": taskValue.customerId,
                        "department": taskValue.departmentId.split('-')[0],
                        "taskdetails": taskValue.taskId + '&&' + taskValue.taskName,
                        "customerProgramId": taskValue.customerProgramId,
                        "projectId": taskValue.projectId,
                        "hours": taskValue.hours,
                        "timesheetDate": taskValue.timesheetDate
                    };
                    $scope.task[count - 1] = (taskDetails);
                });
                getProjects($scope.task[count - 1].department, $scope.task[count - 1].customer, count - 1);
                getTasks($scope.task[count - 1].department, $scope.task[count - 1].customer, count - 1);


                var taskObj = {
                    "dates": {},
                    'totalHours': 0
                };
                var colCount = 0;
                $.each($scope.weekdays, function (dateIndex, dateValue) {
                    //console.log(dateIndex, dateValue);
                    var taskDetails = $filter('filter')(value, {'timesheetDate': dateIndex}, true);

                    $scope.daydetails[count - 1][dateIndex] = taskDetails[0] ? taskDetails[0].hours : 0;
                    $scope.rowTotals[count - 1] = parseInt($scope.rowTotals[count - 1] ? $scope.rowTotals[count - 1] : 0) + parseInt($scope.daydetails[count - 1][dateIndex]);

                    taskObj.totalHours = parseInt(taskObj.totalHours) + (taskDetails[0] ? parseInt(taskDetails[0].hours) : 0);
                    taskObj.dates[dateIndex] = taskDetails[0] ? taskDetails[0].hours : '';
                    $scope.weekDaysHR.dates[dateIndex] = ($scope.weekDaysHR.dates[dateIndex] == undefined ||
                            $scope.weekDaysHR.dates[dateIndex] == '' || $scope.weekDaysHR.dates[dateIndex] == null
                            ? 0 : parseInt($scope.weekDaysHR.dates[dateIndex])) + (taskObj.dates[dateIndex] == undefined ||
                            taskObj.dates[dateIndex] == '' || taskObj.dates[dateIndex] == null ? 0 : parseInt(taskObj.dates[dateIndex]));
                    $scope.colTotals[colCount] = $scope.weekDaysHR.dates[dateIndex];
                    colCount++;
                });
                $scope.weekDaysHR.totalHours = parseInt($scope.weekDaysHR.totalHours) + parseInt(taskObj.totalHours);

                count++;
            });

            console.log($scope.weekdays, $scope.task, $scope.daydetails, $scope.rowTotals, $scope.colTotals);

            $scope.weekTotal = $scope.weekDaysHR.totalHours;

            $scope.weekTotalFN = function () {
                $scope.weekTotal = 0;
                $.each($scope.colTotals, function (index, value) {
                    $scope.weekTotal = $scope.weekTotal + value;
                });
            };

            $scope.onChangeHR = function (rowIndex, colIndex, weekKey) {

                var HrPrev = 0;
                $.each($scope.daydetails, function (index, value) {
                    var rowTotal = 0;
                    var weekPrev = value[weekKey] ? parseInt(value[weekKey]) : 0;
                    HrPrev = HrPrev + weekPrev;

                    $.each(value, function (childIndex, childValue) {
                        var colValue = childValue ? childValue : 0;
                        rowTotal = parseInt(rowTotal) + parseInt(colValue);
                    });
                    $scope.rowTotals[index] = parseInt(rowTotal);
                    $scope.colTotals[colIndex] = HrPrev;
                });
                $scope.weekTotalFN();
            };

            $scope.open = function ($event, calId) {
                $event.preventDefault();
                $event.stopPropagation();
                if (calId === 1) {
                    $scope.opened = true;
                    $scope.opened2 = false;

                }
                if (calId === 2) {
                    $scope.opened2 = true;
                    $scope.opened = false;
                }

            };
            this.onlyWeekendsPredicate = function (date) {
                var day = $scope.myDate.getDay();
                return day === 0 || day === 6;
            };
            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd-MMM-yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];

            $scope.deleteRowsArr = [];

            $scope.deleteThis = function (rowId) {
                var rowIdInArray = $.inArray(rowId, $scope.deleteRowsArr);
                if (rowIdInArray < 0) {
                    $scope.deleteRowsArr.push(rowId);
                } else {
                    $scope.deleteRowsArr.splice(rowIdInArray, 1);
                }
            };


            $scope.deleteRow = function () {
                $.each($scope.deleteRowsArr, function (index, value) {
                    $scope.task.splice(value, 1);
                    $scope.daydetails.splice(value, 1);
                    $scope.divIterator.pop();

                    var rowIdInArray = $.inArray(value, $scope.deleteRowsArr);
                    $scope.deleteRowsArr.splice(rowIdInArray, 1);
                });

                var count = 0;
                $.each($scope.weekdays, function (index, value) {
                    $scope.onChangeHR(0, count, index);
                    count++;
                });

                $scope.ids = [];
            };

            $scope.addRow = function (task, daydetails) {
                var divRowsCount = $scope.divIterator.length;
                var checkTask = false;
                angular.forEach(task, function (value, key) {
                    angular.forEach(value, function (objValue, objKey) {
                        if (!objValue) {
                            checkTask = false;
                        } else {
                            checkTask = true;
                        }
                    });
                });
                if (divRowsCount && !checkTask) {
                    return false;
                } else {
                    constructTimeSheetJson(task, daydetails);
                    $scope.divIterator.push(++divRowsCount);
                }
            };


            $scope.clearTimeSheet = function () {
                console.log($scope.divIterator,$scope.task, $scope.daydetails, $scope.weekdays);
                $scope.dtPopup = '';
                $scope.dtPopup1 = '';
                $scope.weeksdetails = '';
                $scope.divIterator = [];
                $scope.task = [];
                $scope.daydetails = [];
                $scope.weekdays = [];
            };
            
            $scope.taskName = {
                "customerId": "",
                "customerProgramId": "",
                "departmentId": "",
                "projectId": "",
                "taskName": "",
                "hours": "",
                "timesheetDate": ""
            };

            function constructTimeSheetJson(task, daydetails) {
                var taskDetails = {};
                var divRowsCount = $scope.divIterator.length;

                angular.forEach($scope.divIterator, function (value, rowNumb) {
                    var taskInfo = task[rowNumb].taskdetails.split('&&');
                    var taskID = taskInfo[0];
                    taskDetails[taskID] = [];

                    angular.forEach(daydetails[rowNumb], function (value, key, obj) {
                        if (value > 0) {
                            //console.log(value, key, obj, daydetails);
                            //console.log(task[rowNumb]);
                            var partTime = key.split("-");
                            var datefi = "";
                            for (var tt = 0; tt < partTime.length; tt++) {
                                if (partTime[tt].length < 2) {
                                    datefi = datefi + "0" + partTime[tt] + "-";
                                } else {
                                    datefi = datefi + partTime[tt] + "-";
                                }
                            }
                            datefi = datefi.substr(0, datefi.length - 1);
                            var taskDetailsInner = {
                                customerId: task[rowNumb]["customer"],
                                departmentId: task[rowNumb]["department"],
                                taskName: taskInfo[1],
                                customerProgramId: 1/* task[rowNumb]["cpcdetails"] */,
                                projectId: task[rowNumb]["projectId"],
                                hours: value,
                                timesheetDate: datefi
                            };
                            this.push(taskDetailsInner);
                        }

                    }, taskDetails[taskID]);
                });
                //console.log(taskDetails);
                return taskDetails;

            }


            $scope.taskList = [];
            $scope.collectData = {
                "employeeId": "",
                "startDateOfWeek": "",
                "endDateOfWeek": "",
                "timesheets": $scope.multipleTimeSheetList,
                "comments": $scope.comments
            };

            $scope.saveTimeSheet = function (task, daydetails) {

                var timesheetData = constructTimeSheetJson(task, daydetails);
                
                var weekStartdate = $scope.start;
                var weekEndDate = $scope.end;
                var employeeid = $scope.employeeid;
                $scope.collectData.employeeId = employeeid;
                $scope.collectData.startDateOfWeek = weekStartdate;
                $scope.collectData.endDateOfWeek = weekEndDate;
                $scope.collectData.comments = $scope.usercomments;
                $scope.collectData.timesheets = timesheetData;
                $scope.totalhours = 0;
                angular.forEach(timesheetData, function (key, value) {
                    angular.forEach(key, function (innerkey, innerVal) {
                        var hour = innerkey.hours;
                        $scope.totalhours += parseInt(hour);
                    });
                });
                console.log(JSON.stringify(timesheetData));
                if ($scope.totalhours < 40) {
                    swal('error', "Your total hours are not 40 ! You can't submit", 'error');
                } else {
                    swal({
                        title: "Are you sure",
                        text: "Submitting Timesheet ",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, Submit it!",
                        cancelButtonText: "No, cancel it!",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    }, function (isConfirm) {
                        if (isConfirm) {
                            debugger;
                            var timesheeturl = $scope.webserviceshost + "hr/timesheet/save/" + JSON.stringify($scope.collectData);
                            $http({
                                method: "POST",
                                url: timesheeturl,
                                headers: {
                                    'XSRF-TOKEN': $window.sessionStorage.getItem("Access-Token"),
                                    'authorization': $window.sessionStorage.getItem("AuthKey")
                                }
                            }).then(function mySucces(response) {
                                swal("TimeSheet Submitted");
                                $location.path('/headers/timesheethistory');
                            }, function myError(response) {
                                swal('error', 'TimeSheet already submitted for selected period', 'error');
                                $('#loading-bar').remove();
                                $('#loading-bar-spinner').remove();
                            });
                        } else {
                            swal("Cancelled", "Request has been cancelled.)", "error");
                        }
                    });
                }
                console.log($scope.totalhours);
            };
            $scope.clearTimeSheet = function () {
                $scope.dtPopup = '';
                $scope.dtPopup1 = '';
                $scope.weeksdetails = '';
            };
        }
    });
});