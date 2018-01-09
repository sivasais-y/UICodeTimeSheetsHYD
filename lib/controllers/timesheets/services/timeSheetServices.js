app.factory('timeSheetService', ['$http', 'baseURL', '$q', function ($http, baseURL, $q)
    {
        return {

            fetchDevResults: function () {
                return $http.get('lib/localScripts/timesheets/getDevResults.json').then(function (response) {
                    return response.data;
                }, function (errResponse) {
                    return errResponse;
                });
            },
            fetchDevGridResults: function () {
                return $http.get('lib/localScripts/timesheets/getDevGridResults.json').then(function (response) {
                    return response.data;
                }, function (errResponse) {
                    return errResponse;
                });
            }
        };
    }
]);