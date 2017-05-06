'use strict';

var app = angular.module('libreriappApp',
    ['libreriappControllers', 'ngRoute']).
    config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/conference', {
                    templateUrl: '/partials/show_conferences.html',
                    controller: 'ShowConferenceCtrl'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }]);
