'use strict';

var authApp = angular.module('AuthApp');

authApp.config(function ($stateProvider) {

    // Configure Routes using states from ui-router
    $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "app/components/auth/views/index.html",
                controllerAs: 'AU',
                controller: "AuthController"
            });

});

