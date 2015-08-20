var app = angular.module('app', []);


app.service("appService", function ($http, $window) {
    return {
        loadActivities: function () {
            return $http({ method: 'GET', url: '../Home/GetActivities' });
        }
    }
});

app.filter('setDecimal', function ($filter) {
    return function (input) {
        if (isNaN(input)) return input;
        return Math.round(input * 100) / 100;
    };
});

app.controller("MainCtrl", ["$scope", "$http", "$log", "appService", function ($scope, $http, $log, appService) {

    $scope.activities = [];

    $scope.initLoad = function () {
        $scope.totalWorkHrs = 0;
        appService.loadActivities().then(function (res, status, headers, config) {
            var items = angular.fromJson(res.data);
            var itemArray = new Array();
            angular.forEach(items, function (data) {
                var jsonElm = new Object();
                jsonElm.id = data.Id;
                jsonElm.title = data.Title;
                jsonElm.startTime = new Date(parseInt(data.StartTime.replace("/Date(", "").replace(")/", ""), 10));
                jsonElm.endTime = new Date(parseInt(data.EndTime.replace("/Date(", "").replace(")/", ""), 10));
                jsonElm.timeSpent = data.TimeSpent;
                itemArray.push(jsonElm);

                if (jsonElm.title.match("Work")) {
                    $scope.totalWorkHrs = $scope.totalWorkHrs + jsonElm.timeSpent;
                }

            });
            $scope.activities = itemArray;
        });
    }

    $scope.addActivity = function (activity) {
        $http({
            method: 'POST',
            url: '../Home/AddActivity',
            data: {
                'activity': $scope.activity
            }
        })
            .success(function (data, status, headers, config) {
                $scope.activity = "";
                $scope.initLoad();
            }).error(function (data, status, headers, config) {

            });
    };

    $scope.endActivity = function (id) {
        $scope.id = id;
        $http({
            method: 'POST',
            url: '../Home/EndActivity',
            data: {
                'id': $scope.id
            }
        })
            .success(function (data, status, headers, config) {
                $scope.initLoad();
            }).error(function (data, status, headers, config) {

            });
    };

    $scope.clearActivities = function () {
        $http({
            method: 'POST',
            url: '../Home/ClearActivities',
        })
            .success(function (data, status, headers, config) {
                $scope.initLoad();
            }).error(function (data, status, headers, config) {

            });
    };

}]);