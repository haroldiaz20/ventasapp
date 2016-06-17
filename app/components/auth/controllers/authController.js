'use strict';

angular.module('AuthApp')
        .controller('AuthController', ['$location', 'AuthService', '$cookies', function ($location, AuthService, $cookies) {
                var vm = this;
                vm.title = "Iniciar Sesión";
                vm.orgs = [{id: 1, nombre: 'CLUTE S.A.'}, {id: 2, nombre: 'SEKUR PERU S.A.'}];
                vm.usuario = {username: "", password: "", org: vm.orgs[1]};

                console.log(vm.orgs);

                vm.loguear = function (ev) {
                    ev.preventDefault();
                    //console.log(vm.usuario.rpta.id);
//                    console.log(vm.usuario.username);
//                   console.log(vm.usuario.org.id + '-' + vm.usuario.org.nombre);
//                   return;
                    AuthService.setUser(vm.usuario);

                    AuthService.login().then(function (data) {
                        if (data.success === true || data.success === 1) {
                            console.log(data.message);
                            console.log(data.data);
                            Materialize.toast('' + data.message + '', 4000);
                            //$location.path('/pedido/listar');
                            $cookies.put('myFavorite', data.data);
                        } else {
                            Materialize.toast('' + data.message + '', 4000);
                        }
                    });

                };
                vm.salir = function () {
                    console.log("salir de la app");
                    $location.path('/login');

                };
            }]);



