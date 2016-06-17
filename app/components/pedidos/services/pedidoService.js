'use strict';
angular.module('PedidosSekurApp')
        .factory('InvoiceService', function ($http, $q, $cookies) {
            var _invoice = {
                monedas: {},
                almacenes: {}
            };
            _invoice.invoicelines = [];
            return{
                setMonedas: function (Monedas) {
                    _invoice.monedas = Monedas;
                },
                getMonedas: function () {
                    return _invoice.monedas;
                },
                setAlmacenes: function (Almacenes) {
                    _invoice.almacenes = Almacenes;
                },
                setPedidosGenerar: function (PedidosGenerar) {
                    _invoice.pedidosGenerar = PedidosGenerar;
                },
                setFormasPago: function (FormasPago) {
                    _invoice.formasPago = FormasPago;
                },
                setTiposPedido: function (TiposPedido) {
                    _invoice.tiposPedido = TiposPedido;
                },
                setTiposEntrega: function (TiposEntrega) {
                    _invoice.tiposEntrega = TiposEntrega;
                },
                setPaises: function (Paises) {
                    _invoice.paises = Paises;
                },
                setTiposDocumento: function (TiposDocumento) {
                    _invoice.tiposDocumento = TiposDocumento;
                },
                setInvoice: function (invoice) {
                    _invoice = invoice;
                },
                getInvoice: function () {
                    return _invoice;
                },
                newInvoice: function () {
                    var authtoken = $cookies.get('myFavorite');
                    return $http.get(API_URL + '/pedido/invoice/new?authToken="' + authtoken + '"')
                            .then(function (response) {
                                if (typeof response.data === 'object' && response.data !== null) {
                                    return response.data;
                                } else {
                                    // invalid response
                                    return $q.reject(response.data);
                                }

                            }, function (response) {
                                // something went wrong
                                return $q.reject(response.data);
                            });

                }
            };

        })

        .factory('PedidoService', function ($http, $cookies, $q) {
            var _pedido = {};
            _pedido.lines = [];
            return{
                nuevo: function () {
                    _pedido = new Object();
                    _pedido = {
                        documento: {},
                        moneda: {},
                        almacen: {},
                        org: {},
                        agenteComercial: {},
                        formaPago: {},
                        nroDias: {},
                        tipoPedido: {},
                        tipoEntrega: {},
                        cliente: {},
                        lines: [],
                        ordenCompra: '',
                        fechaPedido: '',
                        fechaEnvio: '',
                        subtotal: 0.000,
                        descuento: 0.000,
                        igv: 0.000
                    };
                },
                setPedido: function (Pedido) {
                    _pedido = Pedido;
                },
                getPedido: function () {
                    return _pedido;
                },
                setMoneda: function (Moneda) {
                    _pedido.moneda = Moneda;
                },
                getMoneda: function () {
                    return _pedido.moneda;
                },
                setAlmacen: function (Almacen) {
                    _pedido.almacen = Almacen;
                },
                getAlmacen: function () {
                    return _pedido.almacen;
                },
                setOrg: function (Org) {
                    _pedido.org = Org;
                },
                getOrg: function () {
                    return _pedido.org;
                },
                setDocumento: function (Documento) {
                    _pedido.documento = Documento;
                },
                getDocumento: function () {
                    return _pedido.documento;
                },
                setAgenteComercial: function (Agente) {
                    _pedido.agenteComercial = Agente;
                },
                getAgenteComercial: function () {
                    return _pedido.agenteComercial;
                },
                setFechaPedido: function (fecha) {
                    _pedido.fechaPedido = fecha;
                },
                getFechaPedido: function () {
                    return _pedido.fechaPedido;
                },
                setFormaPago: function (FormaPago) {
                    _pedido.formaPago = FormaPago;
                },
                getFormaPago: function () {
                    return _pedido.formaPago;
                },
                setNroDias: function (NroDias) {
                    _pedido.nroDias = NroDias;
                },
                getNroDias: function () {
                    return _pedido.nroDias;
                },
                setTipoPedido: function (TipoPedido) {
                    _pedido.tipoPedido = TipoPedido;
                },
                getTipoPedido: function () {
                    return _pedido.tipoPedido;
                },
                setTipoEntrega: function (TipoEntrega) {
                    _pedido.tipoEntrega = TipoEntrega;
                },
                getTipoEntrega: function () {
                    return _pedido.tipoEntrega;
                },
                setFechaEnvio: function (fecha) {
                    _pedido.fechaEnvio = fecha;
                },
                getFechaEnvio: function () {
                    return _pedido.fechaEnvio;
                },
                setCliente: function (Cliente) {
                    _pedido.cliente = Cliente;
                },
                getLines: function () {
                    return _pedido.lines;
                },
                exists: function (codigo) {
                    for (var i = 0; i < _pedido.lines.length; i++) {
                        if (_pedido.lines[i].codigo === codigo) {
                            return i;
                            break;
                        }
                    }
                    return -1;
                },
                calcularMontos: function (IGV) {
                    var subtotal = 0.00;
                    var total = 0.000;
                    var montoIgv = 0.000;

                    for (var i = 0; i < _pedido.lines.length; i++) {
                        subtotal += parseFloat(_pedido.lines[i].subtotal);
                        montoIgv += parseFloat(_pedido.lines[i].subtotal) * parseFloat(IGV);
                    }

                    total = montoIgv + subtotal;

                    _pedido.subtotal = Math.round(subtotal * 1000) / 1000;
                    _pedido.igv = Math.round(montoIgv * 1000) / 1000;
                    _pedido.total = Math.round(total * 1000) / 1000;

                },
                replaceLine: function (Producto, pos) {
                    _pedido.lines.splice(pos, 1, Producto);
                },
                addLine: function (Producto) {
                    // Agregamos una nueva línea de pedido
                    _pedido.lines.push(Producto);
                },
                deleteLine: function (pos) {
                    _pedido.lines.splice(pos, 1);
                },
                guardar: function () {
                    var token = $cookies.get('myFavorite');
                    var route = API_URL + '/pedido/invoice/save?authToken="' + token + '"';

                    var objDataForm = _pedido;

                    var config = {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    return $http.post(route, objDataForm, config)
                            .then(function (response) {
                                if (typeof response.data === 'object' && response.data !== null) {
                                    return response.data;
                                } else {
                                    // invalid response
                                    return $q.reject(response.data);
                                }

                            }, function (response) {
                                // something went wrong
                                return $q.reject(response.data);
                            });
                }
            };
        })
        .factory('FormaPagoService', function ($http) {
            var formaPago;
            return{
                setFormaPago: function (pago) {
                    formaPago = pago;
                },
                getNroDias: function () {
                    var cod = formaPago.value;
                    var rpta = $http.get(API_URL + '/pedido/invoice/formaPago/' + cod + '/nroDias')
                            .then(function (response) {
                                return response.data;
                            });
                    return rpta;
                }
            };

        })
        .factory('ProductoService', function ($http, $cookies, $q) {
            var _producto = new Object();
            return{
                nuevo: function () {
                    // Importante!!!! inicializar un nuevo object, puesto que serán necesarias diferentes instancias del producto según se hagan búsquedas
                    _producto = new Object();
                    _producto.codigo = '';
                    _producto.id = '';
                    _producto.subtotal = '0.000';
                    _producto.name = '';
                    _producto.uom = {name: '', value: ''},
                    _producto.cantidad = 0;
                    _producto.descuento = 0.00;
                    _producto.precioUnitario = 0.00;
                    _producto.pricelist = 0.00;
                    _producto.stock = 0;

                },
                setProducto: function (Producto) {
                    _producto = Producto;
                },
                getProducto: function () {
                    return _producto;
                },
                setId: function (Id) {
                    _producto.id = Id;
                },
                setUom: function (Uom) {
                    _producto.uom = Uom;
                },
                setName: function (Name) {
                    _producto.name = Name;
                },
                setStock: function (Stock) {
                    _producto.stock = Stock;
                },
                setPricelist: function (pricelist) {
                    _producto.pricelist = pricelist;
                },
                setCodigo: function (Cod) {
                    _producto.codigo = Cod;
                },
                setSubtotal: function (Subtotal) {
                    _producto.subtotal = Subtotal;
                },
                setPrecioUnitario: function (PrecioUnit) {
                    _producto.precioUnitario = PrecioUnit;
                },
                setCantidad: function (Cantidad) {
                    _producto.cantidad = Cantidad;
                },
                setDescuento: function (Descuento) {
                    _producto.descuento = Descuento;
                },
                buscar: function (codigo, monedaId, almacenId) {
                    // Retrieving a cookie
                    var favoriteCookie = $cookies.get('myFavorite');
                    return $http.get(API_URL + '/products/' + codigo + '&currency=' + monedaId + '&warehouse=' + almacenId + '&authToken="' + favoriteCookie + '"')
                            .then(function (response) {
                                if (typeof response.data === 'object' && response.data !== null) {
                                    return response.data;
                                } else {
                                    // invalid response
                                    return $q.reject(response.data);
                                }

                            }, function (response) {
                                // something went wrong
                                return $q.reject(response.data);
                            });

                }


            };
        })

        .factory('OrderService', function ($http) {
            var _order = {};
            _order.orderlines = [];
            return{
                nueva: function () {
                    _order = {
                        documento: {},
                        moneda: {},
                        almacen: {},
                        org: {},
                        agenteComercial: {},
                        formaPago: {},
                        nroDias: {},
                        tipoPedido: {},
                        tipoEntrega: {},
                        ordenCompra: '',
                        fechaPedido: '',
                        fechaEnvio: '',
                        orderlines: [],
                        subtotal: 0.000,
                        descuento: 0.000,
                        igv: 0.000
                    };
                },
                setOrder: function (Order) {
                    _order = Order;
                },
                getOrder: function () {
                    return _order;
                },
                setMoneda: function (Moneda) {
                    _order.moneda = Moneda;
                },
                getMoneda: function () {
                    return _order.moneda;
                },
                setAlmacen: function (Almacen) {
                    _order.almacen = Almacen;
                },
                getAlmacen: function () {
                    return _order.almacen;
                },
                setOrg: function (Org) {
                    _order.org = Org;
                },
                getOrg: function () {
                    return _order.org;

                },
                setDocumento: function (Documento) {
                    _order.documento = Documento;
                },
                getDocumento: function () {
                    var rpta = $http.post(API_URL + '/pedido/factura/nrodocumento')
                            .then(function (response) {
                                return response.data;
                            });
                    return rpta;
                },
                setAgenteComercial: function (Agente) {
                    _order.agenteComercial = Agente;
                },
                getAgenteComercial: function () {
                    return _order.agenteComercial;
                },
                setFechaPedido: function (fecha) {
                    _order.fechaPedido = fecha;
                },
                setFormaPago: function (FormaPago) {
                    _order.formaPago = FormaPago;
                },
                getFormaPago: function () {
                    return _order.formaPago;
                },
                setNroDias: function (NroDias) {
                    _order.nroDias = NroDias;
                },
                getNroDias: function () {
                    return _order.nroDias;
                },
                setTipoPedido: function (TipoPedido) {
                    _order.tipoPedido = TipoPedido;
                },
                getTipoPedido: function () {
                    return _order.tipoPedido;
                },
                setTipoEntrega: function (TipoEntrega) {
                    _order.tipoEntrega = TipoEntrega;
                },
                getTipoEntrega: function () {
                    return _order.tipoEntrega;
                },
                getFechaPedido: function () {
                    return _order.fechaPedido;
                },
                setFechaEnvio: function (fecha) {
                    _order.fechaEnvio = fecha;
                },
                getFechaEnvio: function () {
                    return _order.fechaEnvio;
                },
                exists: function (codigo) {
                    for (var i = 0; i < _order.orderlines.length; i++) {
                        if (_order.orderlines[i].codigo == codigo) {
                            return i;
                            break;
                        }
                    }
                    return -1;
                },
                calcularMontos: function (IGV) {
                    var subtotal = 0.00;
                    var total = 0.000;
                    var montoIgv = 0.000;

                    for (var i = 0; i < _order.orderlines.length; i++) {
                        subtotal += parseFloat(_order.orderlines[i].subtotal);
                        montoIgv += parseFloat(_order.orderlines[i].subtotal) * parseFloat(IGV);
                    }
                    total = montoIgv + subtotal;

                    _order.subtotal = Math.round(subtotal * 1000) / 1000;
                    _order.igv = Math.round(montoIgv * 1000) / 1000;
                    _order.total = Math.round(total * 1000) / 1000;

                },
                reemplazarLine: function (Producto, pos) {
                    _order.orderlines.splice(pos, 1, Producto);
                },
                agregarLine: function (Producto) {
                    // Agregamos una nueva línea de pedido
                    _order.orderlines.push(Producto);

                },
                editarLine: function () {

                },
                eliminarLine: function () {

                }
            };
        })

        .factory('ClienteService', function ($http, $cookies, $q) {
            var _cliente = {};
            return{
                nuevo: function () {
                    _cliente = new Object();
                    _cliente.id = '';
                    _cliente.identificador = '';
                    _cliente.taxid = '';
                    _cliente.name = '';
                    _cliente.clienteAddressId = '',
                            _cliente.tipoDocumento = {};
                    _cliente.org = {};
                    _cliente.agenteComercial = {};
                    _cliente.address = {
                        id: '',
                        address1: '',
                        address2: '',
                        city: '',
                        postal: '',
                        region: {name: '', value: ''},
                        country: {name: '', value: ''}
                    };
                    _cliente.moneda = {};
                },
                setId: function (Id) {
                    _cliente.id = Id;
                },
                setclienteAddressId: function (ClienteAddId) {
                    _cliente.clienteAddressId = ClienteAddId;
                },
                setRegion: function (region) {
                    _cliente.address.region = region;
                },
                getRegion: function () {
                    return _cliente.address.region;
                },
                setCountry: function (country) {
                    _cliente.address.country = country;
                },
                getCountry: function () {
                    return _cliente.address.country;
                },
                setAddress: function (Address) {
                    _cliente.address = Address;
                },
                getAddress: function () {
                    return _cliente.address;
                },
                setName: function (nombreCom) {
                    _cliente.name = nombreCom;
                },
                getName: function () {
                    return _cliente.name;
                },
                setIdentificador: function (Ident) {
                    _cliente.identificador = Ident;
                },
                getIdentificador: function () {
                    return _cliente.identificador;
                },
                setTaxid: function (taxid) {
                    _cliente.taxid = taxid;
                },
                getTaxid: function () {
                    return _cliente.taxId;
                },
                setOrg: function (Org) {
                    _cliente.org = Org;
                },
                getOrg: function () {
                    return _cliente.org;
                },
                setTipoDocumento: function (TipoDoc) {
                    _cliente.tipoDocumento = TipoDoc;
                },
                getTipoDocumento: function () {
                    return _cliente.tipoDocumento;
                },
                setAgenteComercial: function (Agente) {
                    _cliente.agenteComercial = Agente;
                },
                getAgenteComercial: function () {
                    return _cliente.agenteComercial;
                },
                setMoneda: function (moneda) {
                    _cliente.moneda = moneda;
                },
                getMoneda: function () {
                    return _cliente.moneda;
                },
                setCliente: function (Cliente) {
                    _cliente = Cliente;
                },
                getCliente: function () {
                    return _cliente;
                },
                buscar: function (taxid) {
                    var token = $cookies.get('myFavorite');
                    var rpta = $http.get(API_URL + '/client/' + taxid + '?authToken="' + token + '"')
                            .then(function (response) {
                                return response.data;
                            });
                    return rpta;
                },
                save: function (paymentTermId, paymentMethodId, currencyId) {
                    // PaymentTerm = nroDias, PaymentMethod = formaPago
                    var token = $cookies.get('myFavorite');
                    var route = API_URL + '/client/save?authToken="' + token + '"';
                    var dataObj = {
                        'identificador': _cliente.identificador,
                        'nombreComercial': _cliente.name,
                        'taxid': _cliente.taxid,
                        'payment_term_id': paymentTermId,
                        'payment_method_id': paymentMethodId,
                        'doctype_id': _cliente.tipoDocumento.value,
                        'currency_id': currencyId,
                        'line1': _cliente.address.address1,
                        'line2': _cliente.address.address2,
                        'city': _cliente.address.city,
                        'countryName': _cliente.address.country.name,
                        'countryId': _cliente.address.country.value,
                        'regionName': _cliente.address.region.name,
                        'regionId': _cliente.address.region.value,
                        'postal': _cliente.address.postal
                    };

                    var objDataForm = this.serializeData(dataObj);

                    var config = {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                        }
                    };

                    return $http.post(route, objDataForm, config)
                            .then(function (response) {
                                if (typeof response.data === 'object' && response.data !== null) {
                                    return response.data;
                                } else {
                                    // invalid response
                                    return $q.reject(response.data);
                                }

                            }, function (response) {
                                // something went wrong
                                return $q.reject(response.data);
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

        })

        .factory('PaisesService', function ($http, $cookies) {
            var _pais = {};
            return{
                setPais: function (Pais) {
                    _pais = Pais;
                },
                listarRegiones: function (codigoPais) {
                    var token = $cookies.get('myFavorite');
                    var rpta = $http.get(API_URL + '/location/paises/' + codigoPais + '/regiones?authToken="' + token + '"')
                            .then(function (response) {
                                return response.data;
                            });
                    return rpta;
                }
            };

        });


        