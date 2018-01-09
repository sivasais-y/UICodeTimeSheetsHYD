app.controller('devResultsController', function ($scope, $rootScope, $state, $http, $window, $filter, timeSheetService, uiGridTreeViewConstants) {

    $scope.newSeries = [{
            name: 'Developers',
            colorByPoint: true,
            data: []
        }];
    $scope.newDrilldownSeries = [];
    $scope.initScript = false;
    var devS = {};

    timeSheetService.fetchDevResults().then(function (response) {
        $scope.projectbasedinfo = response.projectbasedinfo.data;
        $scope.series = response.fulldata[0].drillDownInfo.series;

        $.each($scope.projectbasedinfo, function (indexSer, valueSer) {
            var targetSeries = $filter('filter')($scope.series, {'id': valueSer.name, 'name': valueSer.name});


            $.each(targetSeries[0].data, function (index, value) {
                var targetDrillDown = $filter('filter')($scope.series, {'id': value.drilldown, 'name': valueSer.name});


                $.each(targetDrillDown[0].data, function (indexDrill, valueDrill) {

                    var presentInNewSeries = $filter('filter')($scope.newSeries[0].data, {'name': valueDrill.name});
                    if (presentInNewSeries.length <= 0) {
                        var seriesObj = {
                            "name": valueDrill.name,
                            "y": valueDrill.y,
                            "drilldown": valueDrill.name
                        };
                        $scope.newSeries[0].data.push(seriesObj);
                    } else {
                        var presentIndex = $scope.newSeries[0].data.indexOf(presentInNewSeries[0]);
                        $scope.newSeries[0].data[presentIndex].y = presentInNewSeries[0].y + valueDrill.y;
                    }

                    var presentInNewSeriesDrilldown = $filter('filter')($scope.newDrilldownSeries, {'id': valueDrill.name, 'name': valueDrill.name});
                    if (presentInNewSeriesDrilldown.length <= 0) {
                        var drillDownL1 = {
                            "data": [
                                {
                                    "drilldown": 'proj-' + valueSer.name + valueDrill.name,
                                    "name": valueSer.name,
                                    "y": valueDrill.y
                                }
                            ],
                            "name": valueDrill.name,
                            "id": valueDrill.name
                        };
                        $scope.newDrilldownSeries.push(drillDownL1);
                    } else {
                        var presentIndex = $scope.newDrilldownSeries.indexOf(presentInNewSeriesDrilldown[0]);
                        var presentInDrilldownData = $filter('filter')($scope.newDrilldownSeries[presentIndex].data, {'drilldown': 'proj-' + valueSer.name, 'name': valueSer.name});
                        var presentInDrilldownDataIndex = $scope.newDrilldownSeries[presentIndex].data.indexOf(presentInDrilldownData[0]);

                        if (presentInDrilldownData.length <= 0) {
                            $scope.newDrilldownSeries[presentIndex].data.push({
                                "drilldown": 'proj-' + valueSer.name + valueDrill.name,
                                "name": valueSer.name,
                                "y": valueDrill.y
                            });
                        } else {
                            $scope.newDrilldownSeries[presentIndex].data[presentInDrilldownDataIndex].y = $scope.newDrilldownSeries[presentIndex].data[presentInDrilldownDataIndex].y + valueDrill.y;
                        }
                    }


                    var presentInNewSeriesDrilldownL2 = $filter('filter')($scope.newDrilldownSeries, {'name': valueSer.name, 'id': valueSer.name + valueDrill.name});

                    if (presentInNewSeriesDrilldownL2.length <= 0) {
                        var drillDownL2 = {
                            "data": [
                                {
                                    "name": value.name,
                                    "y": valueDrill.y
                                }
                            ],
                            "name": valueSer.name,
                            "id": 'proj-' + valueSer.name + valueDrill.name
                        };
                        $scope.newDrilldownSeries.push(drillDownL2);
                    } else {
                        var presentIndex = $scope.newDrilldownSeries.indexOf(presentInNewSeriesDrilldownL2[0]);
                        $scope.newDrilldownSeries[presentIndex].data.push({
                            "name": value.name,
                            "y": valueDrill.y
                        });
                    }

                    if (devS[valueDrill.name]) {
                        if (devS[valueDrill.name][valueSer.name]) {
                            devS[valueDrill.name][valueSer.name][value.name] = valueDrill.y;
                        } else {
                            devS[valueDrill.name][valueSer.name] = {};
                            devS[valueDrill.name][valueSer.name][value.name] = valueDrill.y;
                        }
                    } else {
                        devS[valueDrill.name] = {};
                        devS[valueDrill.name][valueSer.name] = {};
                        devS[valueDrill.name][valueSer.name][value.name] = valueDrill.y;
                    }
                });
            });
        });

        var newMod = [];
        $.each(devS, function (indexDev, valueDev) {
            $.each(valueDev, function (indexProj, valueProj) {
                $.each(valueProj, function (indexMod, valueMod) {
                    var presentInNewSeriesDrilldownL2 = $filter('filter')(newMod, {'name': indexProj});

                    if (presentInNewSeriesDrilldownL2.length <= 0) {
                        var drillDownL2 = {
                            "data": [
                                {
                                    "name": indexMod,
                                    "y": valueMod
                                }
                            ],
                            "name": indexProj,
                            "id": 'proj-' + indexProj
                        };
                        newMod.push(drillDownL2);
                    } else {
                        var presentIndex = newMod.indexOf(presentInNewSeriesDrilldownL2[0]);
                        newMod[presentIndex].data.push({
                            "name": indexMod,
                            "y": valueMod
                        });
                    }
                });
            });
        });

        $scope.initScript = true;

    }, function (errResponse) {
        console.log(JSON.stringify(errResponse));
    });


    /*  Grid Data Processing   */

    $scope.gridDeveloperOption = {
        paginationPageSizes: false,
        enableFiltering: true,
        enableRowSelection: true,
        enableColumnResizing: true,
        multiSelect: false,
        resizable: true,
        enableFullRowSelection: true,
        paginationPageSize: 15,
        appScopeProvider: $scope,
        showTreeExpandNoChildren: true,
        columnDefs: [
            {name: 'developerName', width: '25%'},
            {name: 'application', width: '30%'},
            {name: 'violationcount', width: '20%'}
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    var newGridData = [];
    var reformattedData = {};
    timeSheetService.fetchDevGridResults().then(function (response) {
        $scope.gridData = response.gridData;

        $.each($scope.gridData.analysisDetails.appDetails, function (indexApp, valueApp) {

            $.each(valueApp.devDetails, function (indexDev, valueDev) {

                if (reformattedData[valueDev.developer_name]) {
                    reformattedData[valueDev.developer_name].griObj.violationcount = reformattedData[valueDev.developer_name].griObj.violationcount + valueDev.devCount;
                } else {
                    reformattedData[valueDev.developer_name] = {
                        "applications": [],
                        "griObj": {
                            "collectionname": "",
                            "developerName": valueDev.developer_name,
                            "analysisdate": "",
                            "violationcount": valueDev.devCount,
                            "baseUrl": "",
                            "totalFiles": "",
                            "mid_path": "",
                            "level": 0,
                            "$$treeLevel": 0
                        }
                    };
                }

                var appObjInArr = $filter('filter')(reformattedData[valueDev.developer_name].applications, {"application": valueApp.applicationName});
                if (appObjInArr.length < 1) {
                    var arrAppObj = {
                        "gridObj": {
                            "application": valueApp.applicationName,
                            "collectionname": "",
                            "jobDetails": "",
                            "language": valueApp.coding_language,
                            "analysisdate": "",
                            "totalFiles": "",
                            "project_id": valueApp.project_id,
                            "parent_project_id": valueApp.project_id,
                            "id": valueApp.id,
                            "guid": valueApp.guid,
                            "violationcount": valueDev.devCount,
                            "developer_name": valueDev.developer_name
                        },
                        "modules": []
                    };
                    reformattedData[valueDev.developer_name].applications.push(arrAppObj);
                }

            });

            $.each(valueApp.depthCollect, function (indexMod, valueMod) {

            });
        });


        $.each(reformattedData, function (indexDev, valueDev) {
            newGridData.push(valueDev.griObj);
            $.each(valueDev.applications, function (indexApp, valueApp) {
                newGridData.push(valueApp.gridObj);
            });
        });

        $scope.gridDeveloperOption.data = newGridData;

        console.log(JSON.stringify(newGridData), reformattedData);
    }, function (errRes) {
        console.log(JSON.stringify(errRes));
    });
});