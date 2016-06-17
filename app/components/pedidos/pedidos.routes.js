'use strict';
var pedidosApp = angular.module('PedidosSekurApp');
pedidosApp.config(function ($stateProvider) {
    // Configure Routes using states from ui-router
    $stateProvider
            .state('app.pedido', {
                url: "^/pedido",
                abstract: true,
                template: "<div ui-view></div>",
                controllerAs: 'P',
                controller: 'PedidoController'
            })

            .state('app.pedido.registro', {
                url: '/u',
                abstract: true,
                templateUrl: "app/components/pedidos/views/nuevo.html",
                controller: 'NuevoPedidoController',
                controllerAs: 'NP'
            })

            // Tener cuidado al momento de declarar el las vistas absolutas: nombreVista@nombreEstado
            // nombreVista es el nombre con el que se encuentra en el template <div ui-view="nombreVista"></div>
            // nombreEstado es el nombre del estado donde se encuentra el template que contendrá a las vistas, en este caso es 'app.pedido.registro'
            .state('app.pedido.registro.nuevo', {
                url: '/nuevo',
                views: {
                    'general@app.pedido.registro': {
                        templateUrl: 'app/components/pedidos/views/general.html',
                        controller: 'NuevoPedidoGeneralController',
                        controllerAs: 'PG'
                    },
                    'detalle@app.pedido.registro': {
                        templateUrl: 'app/components/pedidos/views/detalle.html',
                        controller: 'NuevoPedidoDetalleController',
                        controllerAs: 'PD'
                    },
                    'cliente@app.pedido.registro': {
                        templateUrl: 'app/components/pedidos/views/cliente.html',
                        controller: 'NuevoPedidoClienteController',
                        controllerAs: 'PC'
                    }
                }
            })

            .state('app.pedido.listar', {
                url: "/listar",
                templateUrl: "app/components/pedidos/views/listar.html",
                controllerAs: 'LP',
                controller: "ListarPedidoController"
            });
});


