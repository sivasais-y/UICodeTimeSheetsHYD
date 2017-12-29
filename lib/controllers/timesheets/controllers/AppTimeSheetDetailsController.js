
app.controller('AppTimeSheetDetailsController', function ($scope, $rootScope, $http, $window, $filter) {


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

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy-MM-dd', 'dd-MMM-yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    var employeeid = $window.sessionStorage.getItem("EmployeeId");
    var date2 = new Date();
    var startyyyy = date2.getFullYear();
    var startdd = date2.getDate();
    var startmm = date2.getMonth() + 1;
    var endyyyy = date2.getFullYear();
    var enddd = date2.getDate();
    var totalNoOfDays = new Date(startyyyy, startmm, 0).getDate();
    var endmm = date2.getMonth() + 1;

    if (startmm < 10) {
        startmm = '0' + startmm;
    }
    if (endmm < 10) {
        endmm = '0' + endmm;
    }
    /* $('#loading-bar').remove(); */
    $scope.start = startyyyy + '-' + startmm + '-' + 01;
    $scope.end = endyyyy + '-' + endmm + '-' + totalNoOfDays;
    var timesheethistory = 'lib/localScripts/timesheets/historylist.json';
    $http(
            {
                method: "GET",
                url: timesheethistory,
                headers: {
                    'XSRF-TOKEN': $window.sessionStorage
                            .getItem("Access-Token"),
                    'authorization': $window.sessionStorage
                            .getItem("AuthKey")
                }
            })
            .then(
                    function mySucces(response) {
                        console.log(response.data);
                        if (response != 'undefiend' && response != "") {

                            $scope.allUsers = response.data;
                            $scope.pageSize = 50;
                            $scope.allItems = $scope.allUsers;
                            $scope.reverse = false;
                            // console.log($scope.allUsers.length);
                        }
                    }, function myError(response) {
                $('#loading-bar').remove();
                $('#loading-bar-spinner').remove();
                console.log(response);
            });

    $scope.THSEmployeeID = '';
    $scope.THSWStartDate = '';
    $scope.THSWEndDate = '';

    $scope.showDetails = function (sequence) {
        // $window.location.path='headers.timesheet';
        var timesheetDetail = 'lib/localScripts/timesheets/history_details.json ';

        $http(
                {
                    method: "GET",
                    url: timesheetDetail,
                    headers: {
                        'XSRF-TOKEN': $window.sessionStorage
                                .getItem("Access-Token"),
                        'authorization': $window.sessionStorage
                                .getItem("AuthKey")
                    }
                })
                .then(function mySucces(response) {

                    if (response != 'undefiend' && response != "") {
                        $scope.timeSheetDetails = response.data;
                        $scope.timesheetcomments = $scope.timeSheetDetails.comments;
                        $scope.weekDays = {};
                        $scope.tasks = [];
                        $scope.weekDaysHR = {
                            "dates": {},
                            'totalHours': 0
                        };
                        $scope.dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        if ($scope.timeSheetDetails && $scope.timeSheetDetails.startDateOfWeek
                                && $scope.timeSheetDetails.endDateOfWeek) {
                            var weekStart = new Date($scope.timeSheetDetails.startDateOfWeek);

                            for (var i = 0; i <= 6; i++) {
                                var weekKey = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000); // weekKey.setDate(weekStart.getDate()+i);

                                var weekDate = weekKey.getDate() < 10 ? '0' + weekKey.getDate() : weekKey.getDate();
                                var weekMonth = weekKey.getMonth() + 1 < 10 ? '0' + parseInt(weekKey.getMonth() + 1)
                                        : weekKey.getMonth() + 1;
                                var weekYear = weekKey.getFullYear();

                                $scope.weekDays[weekDate + '-' + weekMonth + '-' + weekYear] = {
                                    date: weekDate,
                                    day: $scope.dayName[weekKey.getDay()]
                                };

                                console.log(weekDate, weekMonth, weekYear);
                            }
                           
                            $.each($scope.timeSheetDetails.timesheets, function (index, value) {
                                var taskObj = {
                                    "dates": {},
                                    'totalHours': 0
                                };
                                $.each($scope.weekDays, function (dateIndex, dateValue) {

                                    // console.log(dateIndex,
                                    // dateValue);
                                    var taskDetails = $filter('filter')
                                            (value, {
                                                'timesheetDate': dateIndex
                                            }, true);

                                    if (taskDetails.length > 0 && (taskObj.taskId == undefined
                                            || taskObj.taskId == null || taskObj.taskId == '')) {
                                        // console.log(taskDetails);
                                        taskObj['customerId'] = taskDetails[0].customerId;
                                        taskObj['customerName'] = taskDetails[0].customerName;
                                        taskObj['customerProgramId'] = taskDetails[0].customerProgramId;
                                        taskObj['customerProgramCode'] = taskDetails[0].customerProgramCode;
                                        taskObj['customerProgramType'] = taskDetails[0].customerProgramType;
                                        taskObj['departmentId'] = taskDetails[0].departmentId;
                                        taskObj['projectId'] = taskDetails[0].projectId;
                                        taskObj['projectName'] = taskDetails[0].projectName;
                                        taskObj['projectType'] = taskDetails[0].projectType;
                                        taskObj['taskId'] = taskDetails[0].taskId;
                                        taskObj['taskName'] = taskDetails[0].taskName;
                                    }

                                    taskObj.totalHours = parseInt(taskObj.totalHours)
                                            + (taskDetails[0] ? parseInt(taskDetails[0].hours)
                                                    : 0);
                                    taskObj.dates[dateIndex] = taskDetails[0] ? taskDetails[0].hours
                                            : '';
                                    $scope.weekDaysHR.dates[dateIndex] = ($scope.weekDaysHR.dates[dateIndex] == undefined
                                            || $scope.weekDaysHR.dates[dateIndex] == ''
                                            || $scope.weekDaysHR.dates[dateIndex] == null ? 0
                                            : parseInt($scope.weekDaysHR.dates[dateIndex]))
                                            + (taskObj.dates[dateIndex] == undefined
                                                    || taskObj.dates[dateIndex] == ''
                                                    || taskObj.dates[dateIndex] == null ? 0
                                                    : parseInt(taskObj.dates[dateIndex]));
                                });
                                $scope.weekDaysHR.totalHours = parseInt($scope.weekDaysHR.totalHours)
                                        + parseInt(taskObj.totalHours);
                                $scope.tasks
                                        .push(taskObj);
                                // console.log($scope.weekDaysHR);
                            });
                        }

                    }
                });
        console.log($scope.THSEmployeeID, $scope.THSWStartDate, $scope.THSWEndDate);

    };
    
    $scope.editTimesheet = function (sequence) {
        window.location.hash =  '#!/editTimeSheet/'+ sequence;
        
    };
    
    $scope.searchtimesheet = function () {

        var startdate = $scope.dtPopup;
        var date1 = new Date(startdate);
        var enddate = $scope.dtPopup1;
        var date2 = new Date(enddate);
        if (startdate > enddate) {
            swal("Error",
                    "From date should be less than to date.)",
                    "error");
            return;
        }

        var startyyyy = date1.getFullYear();
        var startdd = date1.getDate();
        var startmm = date1.getMonth() + 1;
        var endyyyy = date2.getFullYear();
        var enddd = date2.getDate();

        var endmm = date2.getMonth() + 1;
        ;
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

        $scope.start = startyyyy + '-' + startmm + '-'
                + startdd;
        $scope.end = endyyyy + '-' + endmm + '-' + enddd;

        var timesheethistory = $scope.webserviceshost
                + 'hr/timesheet/summary/' + employeeid + "/"
                + $scope.start + "/" + $scope.end;
        $http(
                {
                    method: "GET",
                    url: timesheethistory,
                    headers: {
                        'XSRF-TOKEN': $window.sessionStorage
                                .getItem("Access-Token"),
                        'authorization': $window.sessionStorage
                                .getItem("AuthKey")
                    }
                })
                .then(
                        function mySucces(response) {
                            console.log(response.data);
                            if (response != 'undefiend'
                                    && response != "") {

                                $scope.allUsers = response.data;
                                $scope.pageSize = 50;
                                $scope.allItems = $scope.allUsers;
                                $scope.reverse = false;

                                $scope.resetAll = function () {
                                    $scope.filteredList = $scope.allItems;
                                    $scope.employeeId = '';

                                    $scope.firstName = '';
                                    $scope.lastName = '';
                                    $scope.weekStartDate = '';
                                    $scope.weekEndDate = '';
                                    $scope.totalHours = '';
                                    $scope.timesheetStatus = '';
                                    $scope.currentPage = 0;
                                    $scope.Header = ['', '',
                                        '', '', '', '', ''];
                                }

                                $scope.search = function () {
                                    $scope.filteredList = filteredListService
                                            .searched(
                                                    $scope.allItems,
                                                    $scope.searchText);

                                    if ($scope.searchText == '') {
                                        $scope.filteredList = $scope.allItems;
                                    }
                                    $scope.pagination();
                                }

                                $scope.pagination = function () {
                                    $scope.ItemsByPage = filteredListService
                                            .paged(
                                                    $scope.filteredList,
                                                    $scope.pageSize);
                                };

                                $scope.setPage = function () {
                                    $scope.currentPage = this.n;
                                };

                                $scope.firstPage = function () {
                                    $scope.currentPage = 0;
                                };

                                $scope.lastPage = function () {
                                    $scope.currentPage = $scope.ItemsByPage.length - 1;
                                };

                                $scope.range = function (input,
                                        total) {
                                    var ret = [];
                                    if (!total) {
                                        total = input;
                                        input = 0;
                                    }
                                    for (var i = input; i < total; i++) {
                                        if (i != 0
                                                && i != total - 1) {
                                            ret.push(i);
                                        }
                                    }
                                    return ret;
                                };

                                $scope.sort = function (sortBy) {
                                    $scope.resetAll();

                                    $scope.columnToOrder = sortBy;

                                    // $Filter
                                    // -
                                    // Standard
                                    // Service
                                    $scope.filteredList = $filter(
                                            'orderBy')
                                            (
                                                    $scope.filteredList,
                                                    $scope.columnToOrder,
                                                    $scope.reverse);

                                    if ($scope.reverse)
                                        iconName = 'glyphicon glyphicon-chevron-up';
                                    else
                                        iconName = 'glyphicon glyphicon-chevron-down';

                                    if (sortBy === 'EmpId') {
                                        $scope.Header[0] = iconName;
                                    } else if (sortBy === 'firstName') {
                                        $scope.Header[1] = iconName;
                                    } else if (sortBy === 'lastName') {
                                        $scope.Header[2] = iconName;
                                    } else if (sortBy === 'weekStartDate') {
                                        $scope.Header[3] = iconName;
                                    } else if (sortBy === 'weekEndDate') {
                                        $scope.Header[4] = iconName;
                                    } else if (sortBy === 'totalHours') {
                                        $scope.Header[5] = iconName;
                                    } else if (sortBy === 'timesheetStatus') {
                                        $scope.Header[6] = iconName;
                                    } else {
                                        $scope.Header[1] = iconName;
                                    }

                                    $scope.reverse = !$scope.reverse;

                                    $scope.pagination();
                                };

                                // By
                                // Default
                                // sort
                                // ny
                                // Name
                                $scope.sort('name');

                                // console.log($scope.allUsers.length);
                            }
                        }, function myError(response) {
                    $('#loading-bar').remove();
                    $('#loading-bar-spinner').remove();
                    console.log(response);
                });

    }
});