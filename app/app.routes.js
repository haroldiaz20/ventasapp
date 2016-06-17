'use strict';
var URL = 'http://localhost/xxx';
var API_URL = 'http://localhost/aplicacionventas';

var routerApp = angular.module('SekurVentasApp', ['ui.router', 'PedidosSekurApp']);

routerApp.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
        
        $rootScope.$on("$stateChangeError", console.log.bind(console));
        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

    }
]);

routerApp.config(function ($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider, $httpProvider) {

    //$urlMatcherFactoryProvider.strictMode(false);

    // Configure Routes using states from ui-router
    $urlRouterProvider.otherwise('/login');

    $stateProvider
            .state('inicio', {
                url: "/inicio",
                template: "<div>hola mundo</div>"
            })

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "app/components/app/views/index.html",
                controller: "AppController"
            })
            .state('salir', {
                url: "/salir",
                controllerAs: "AU",
                controller: "AuthController"
            });

    // use the HTML5 History API
    $locationProvider.html5Mode(true);


});



routerApp.controller('AppController', ['$scope', function ($scope) {
        $(".button-collapse").sideNav();
        // Initialize collapsible (uncomment the line below if you use the dropdown variation)
        $('.collapsible').collapsible();

    }]);





