app.controller('AppTimeSheetsController', ['$scope', '$filter', '$sce', '$http', '$rootScope', '$window', '$location',
    function ($scope, $filter, $sce, $http, $rootScope, $window, $location) {
        $('#downcontent').hide();
        $scope.footerTotalHour = [];
        if ($scope.mactrl) {
            if ($scope.mactrl.sidebarToggle) {
                $scope.mactrl.sidebarToggle.left = false;
            }
        }
        function gettingDetails() {
            $scope.$on(function (x) {
                console.log('a');

            });
        }
        $scope.$on(function (x) {
            console.log('a');

        });
        $scope.projects = [];
        $scope.tasks = [];
        $scope.onlyNumbers = /^\d+$/;

        $scope.divIterator = [1];
        $scope.totalhourhead = '';
        $scope.today = function () {
            $scope.dt = new Date();
        };
        $scope.today();

        $scope.myDate = new Date();

        $scope.toggleMin = function () {
            $scope.minDate = new Date($scope.myDate.getFullYear(), $scope.myDate.getMonth() - 11, $scope.myDate.getDate());
        };
        $scope.toggleMin();

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
        $scope.changeweekselected = function () {
            $('#downcontent').show();
            $scope.totalhourhead = {};
            $scope.weekTotal = '';
            $scope.rowTotals = [];
            $scope.colTotals = [0, 0, 0, 0, 0, 0, 0];
            var startdate = $scope.dtPopup;
            var date2 = new Date(startdate);

            Date.prototype.addDays = function (days) {
                var dat = new Date(this.valueOf());
                dat.setDate(dat.getDate() + days);
                return dat;
            };

            var dat = startdate;
            var date1 = dat.addDays(6);// new Date(enddate);
            $scope.dtPopup1 = date1;

            if (startdate > date1) {
                swal("Error", "From date should be less than to date.", "error");
                return;
            }

            if (date2.getDay() != 1 || date1.getDay() != 0) {
                swal("Error", "Starte date should be selected as monday and end date should be seleted as sunday ", "error");
                return;
            }
            var startyyyy = date2.getFullYear();
            var startdd = date2.getDate();
            var startmm = date2.getMonth() + 1;
            var endyyyy = date1.getFullYear();
            var enddd = date1.getDate();
            var totalNoOfDays = new Date(startyyyy, startmm, 0).getDate();
            var endmm = date1.getMonth() + 1;

            if (startdd < 10) {
                startdd = '0' + startdd;
            }
            if (startmm < 10) {
                startmm = '0' + startmm;
            }
            if (enddd < 10) {
                enddd = '0' + enddd;
            }
            if (endmm < 10) {
                endmm = '0' + endmm;
            }

            $scope.start = startyyyy + '-' + startmm + '-' + startdd;
            $scope.end = endyyyy + '-' + endmm + '-' + enddd;
            $scope.weeksdetails = "selected week as " + $filter('date')($scope.start, "dd-MMM-yyyy")
                    + "  to  " + $filter('date')($scope.end, "dd-MMM-yyyy");
            var weeksdetails = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

            var weekday = [];
            for (var x = 0; x < 7; x++) {

                if (startdd > totalNoOfDays) {
                    startdd = 1;
                    startmm = startmm + 1;
                    if (startmm > 12) {
                        startmm = 1;
                    }
                }
                var dateandDay = {
                    'day': "",
                    'date': ""
                };
                dateandDay.day = startdd + '(' + weeksdetails[x] + ')';
                dateandDay.date = startdd + '-' + startmm + '-' + startyyyy;
                weekday.push(dateandDay);
                startdd++;
            }
            $scope.weekdays = weekday;
            $scope.totalhourhead = "Total hours";
            $scope.daydetails = {};
            $scope.task = {}; 
        console.log($scope.weekdays);
        };
        var employeeid = $window.sessionStorage.getItem("EmployeeId");

        var employeeDetails = 'lib/localScripts/timesheets/employeedetails.json';
        var customeDetails = 'lib/localScripts/timesheets/customer.json';
        var departments = 'lib/localScripts/timesheets/department.json';

        var allcpc = 'lib/localScripts/timesheets/customerprogramcode.json';
        /*
         * var allproject = $scope.webserviceshost +
         * 'hr/project/all';
         */
        $scope.fillProject = function (task, divindex) {

            console.log(task);
            var customer = task[divindex].customer;
            var department = task[divindex].department;
            console.log(customer + "   " + department);
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
                        swal('error', 'No project mapped with current selection', 'error');
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
                        'XSRF-TOKEN': $window.sessionStorage
                                .getItem("Access-Token"),
                        'authorization': $window.sessionStorage
                                .getItem("AuthKey")
                    }
                }).then(function mySucces(response) {
                    $scope.tasks[divindex] = response.data;
                    if ($scope.tasks[divindex].length == 0) {
                        swal('error', 'No Task mapped with current selection', 'error');
                    }
                }, function myError(response) {
                    $('#loading-bar').remove();
                    $('#loading-bar-spinner').remove();
                    console.log(response);
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
            console.log(response);
        });

        $http({
            method: "GET",
            url: customeDetails,
            headers: {
                'XSRF-TOKEN': $window.sessionStorage
                        .getItem("Access-Token"),
                'authorization': $window.sessionStorage
                        .getItem("AuthKey")
            }
        }).then(function mySucces(response) {
            $scope.customers = response.data;
        }, function myError(response) {
            $('#loading-bar').remove();
            $('#loading-bar-spinner').remove();
            console.log(response);
        });

        $http({
            method: "GET",
            url: departments,
            headers: {
                'XSRF-TOKEN': $window.sessionStorage
                        .getItem("Access-Token"),
                'authorization': $window.sessionStorage
                        .getItem("AuthKey")
            }
        }).then(function mySucces(response) {
            $scope.departments = response.data;
        }, function myError(response) {
            $('#loading-bar').remove();
            $('#loading-bar-spinner').remove();
            console.log(response);
        });

        $http({
            method: "GET",
            url: allcpc,
            headers: {
                'XSRF-TOKEN': $window.sessionStorage
                        .getItem("Access-Token"),
                'authorization': $window.sessionStorage
                        .getItem("AuthKey")
            }
        }).then(function mySucces(response) {
            $scope.cpcs = response.data;
        }, function myError(response) {
            $('#loading-bar').remove();
            $('#loading-bar-spinner').remove();
            console.log(response);
        });

        $scope.updateTotalhour = function () {

        };

        $scope.taskList = [];
        $scope.collectData = {
            "employeeId": "",
            "startDateOfWeek": "",
            "endDateOfWeek": "",
            "timesheets": $scope.multipleTimeSheetList,
            "comments": $scope.comments
        };

        var myTaskName;

        $scope.deleteRow = function () {
            console.log($scope.ids);
            var obj = $scope.ids[divindex];

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var val = obj[key];
                    if (val) {
                        $scope.divIterator.pop(key);
                        obj.key = false;
                    }
                    console.log(val);
                }
            }
            /*
             * var pushval = $scope.deleteval.length; for (var x =
             * 0; x < pushval; x++) {
             * $scope.divIterator.pop(deleteval); }
             */

        };

        $scope.countTotalhours = function (value, modelName) {
            $scope.modelName = $scope.modelName + value;
        };

        $scope.saveTimeSheet = function (task, daydetails) {

            var timesheetData = constructTimeSheetJson(task, daydetails);
            // console.log(timesheetData);
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

                    console.log(key, value.hours);
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
            // console.log($scope.collectData);

            // console.log(timesheetData);
            // $location.path('/headers/timesheethistory')
            // console.log(JSON.stringify($scope.collectData));
        };
        $scope.clearTimeSheet = function () {
            $scope.dtPopup = '';
            $scope.dtPopup1 = '';
            $scope.weeksdetails = '';
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

        var taskDetails = {};

        function constructTimeSheetJson(task, daydetails) {

            var divRowsCount = $scope.divIterator.length;

            angular.forEach($scope.divIterator, function (value, rowNumb) {
                var taskInfo = task[rowNumb].taskdetails.split('&&');
                var taskID = taskInfo[0];
                taskDetails[taskID] = [];

                angular.forEach(daydetails[rowNumb], function (value, key, obj) {
                   
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
                        customerProgramId: 1,
                        projectId: task[rowNumb]["projectId"],
                        hours: value,
                        timesheetDate: datefi
                    };
                    this.push(taskDetailsInner);
                }, taskDetails[taskID]);
            });
            return taskDetails;

        }

        $scope.rowTotals = [];
        $scope.colTotals = [0, 0, 0, 0, 0, 0, 0];
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

    }]);
                