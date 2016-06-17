'use strict';

angular.module('AuthApp')
        .factory('AuthService', function ($http, $q, $window) {
            var usuario = {};
            return {
                setUser: function (user) {
                    usuario = user;
                },
                getUser: function () {
                    if (this.usuario != null) {
                        return true;
                    } else {
                        return false;
                    }
                },
                login: function () {
                    var uName = usuario.username;
                    var uPass = usuario.password;
                    var org = usuario.org.nombre;
                    var orgId = usuario.org.id;
                    var route = API_URL + '/users/verificar';
                    var dataObj = {
                        'username': uName,
                        'password': uPass,
                        'org': org,
                        'orgId': orgId
                    };
                    var objDataForm = this.serializeData(dataObj);

                    var config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                        }
                    };
                    // IMPORTANTE
                    // Colocar el return antes de la llamada al servicio $http.post
                    // De esta forma, podremos obtener la respuesta en el controlador y realizar 
                    // las acciones correspondientes ;)

                    return $http.post(route, objDataForm, config).then(function (response) {
                        if (response.data.data != null) {
                            var token = response.data.data;
                            // Guardamos el JWT generado por el servidor, pero sin las comillas.
                            $window.sessionStorage.setItem("userInfo", JSON.stringify(token));
                        } else {
                            $window.sessionStorage.removeItem("userInfo");
                            
                        }

                        return response.data;
                    }, function (error) {
                        deferred.reject(error);
                    });

                },
                serializeData: function (data) {
                    // If this is not an object, defer to native stringification.
                    if (!angular.isObject(data)) {
                        return((data == null) ? "" : data.toString());
                    }
                    var buffer = [];
                    // Serialize each key in the object.
                    for (var name in data) {
                        if (!data.hasOwnProperty(name)) {
                            continue;
                        }
                        var value = data[ name ];
                        buffer.push(
                                encodeURIComponent(name) +
                                "=" +
                                encodeURIComponent((value == null) ? "" : value)
                                );
                    }
                    // Serialize the buffer and clean it up for transportation.
                    var source = buffer
                            .join("&")
                            .replace(/%20/g, "+")
                            ;
                    return source;
                }

            };

        });