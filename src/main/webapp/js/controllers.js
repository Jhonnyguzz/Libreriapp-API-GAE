'use strict';

/**
 * The root conferenceApp module.
 *
 * @type {conferenceApp|*|{}}
 */
var libreriappApp = libreriappApp || {};

/**
 * @ngdoc module
 * @name conferenceControllers
 *
 * @description
 * Angular module for controllers.
 *
 */
libreriappApp.controllers = angular.module('libreriappControllers', []);

/**
 * @ngdoc controller
 * @name MyProfileCtrl
 *
 * @description
 * A controller used for the My Profile page.
 */
libreriappApp.controllers.controller('listBooksCtrl',
    function ($scope, $log) {
        $scope.submitted = false;
        $scope.loading = false;

        $scope.listAllBooks = function () {
            $scope.submitted = true;
            $scope.loading = true;
            
            gapi.client.libreriapp.listBooks().execute(function(resp) {
                    if (!resp.code) {
                            resp.items = resp.items || [];
                            
                            $scope.thebooks = [];
                            $scope.justtest = resp.items;
                            angular.forEach(resp.items, function(book) {
                            	$scope.thebooks.push(book);
                            });
                    }
            });
        };
        
    });

