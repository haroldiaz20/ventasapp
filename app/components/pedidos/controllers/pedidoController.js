
var pedidos = angular.module('PedidosSekurApp');


pedidos.controller('PedidoController', ['$scope', '$stateParams', '$timeout', '$state',
    function ($scope, $stateParams, $timeout, $state) {
        var self = this;
        self.ocultar = true;
        self.titulo = 'Pedidos de venta';
        self.actual = 1;
        self.orgs = [{id: 1, nombre: 'CLUTE S.A.'}, {id: 2, nombre: 'SEKUR PERU S.A.'}];

        self.org = {};
        console.log($state.current.name);
        $(".dropdown-button").dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: true, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });

    }
]);



pedidos.controller('NuevoPedidoController', ['$scope', '$state', '$timeout', '$stateParams', 'ProductoService',
    'PedidoService', 'InvoiceService', 'FormaPagoService', 'ClienteService', 'PaisesService',
    function ($scope, $state, $timeout, $stateParams, ProductoService, PedidoService, InvoiceService, FormaPagoService,
            ClienteService, PaisesService) {
        $('ul.tabs').tabs();
        $('.collapsible').collapsible({
            accordion: true
        });

        var self = this;


        /*
         * Nos permitirá cargar la información de la Factura en cada uno de los controles de la aplicación
         */
        self.invoice = {
            monedas: {},
            almacenes: {}
        };
        /*
         * Este objeto almacenará la información de cada uno de los pedidos del cliente, tales como
         * Invoicelines, moneda, etc..
         */
        self.pedido = {};
        self.pedido.lines = [];
        self.pal = "holasssss";
        self.pedido.tipoDocumento = {name:'asas',value:''};
        /*
         * Almacenará información de un producto específico, que el usuario haya buscado recientemente.
         */
        self.producto = {};
        /*
         * Almacenará información de un cliente específico, que el usuario haya buscado recientemente.
         */
        self.cliente = {};
        self.cliente = ClienteService.nuevo();
        /**
         * Almacenará la información de la dirección de un cliente específico
         */
        self.isValidCliente = {};
        /*
         * Es el ID o POSICIÓN de la línea (en el array) que el usuario desea remover
         */
        self.lineToRemove = "";
        /*
         * Estas variables nos permitiran trabajar con valores de los "selects" 
         */
        self.moneda;
        self.almacen;
        self.pedidoGenerar;
        self.formaPago;
        self.nroDias;
        self.tipoPedido;
        self.tipoEntrega;
        self.pais;
        self.tipoDocumento;
        self.region;


        PedidoService.nuevo();

        /*
         * Inicializamos un nuevo Invoice
         */
        InvoiceService.newInvoice().then(function (response) {
            if (response.success === true || response.success === 1) {
                // Materialize.toast(response.message, 2000);
                // PedidoService.setMoneda();
                console.log(response.data.monedas);

                InvoiceService.setMonedas(response.data.monedas);
                InvoiceService.setAlmacenes(response.data.almacenes);
                InvoiceService.setPedidosGenerar(response.data.pedidosGenerar);
                InvoiceService.setFormasPago(response.data.formasPago);
                InvoiceService.setTiposPedido(response.data.tiposPedido);
                InvoiceService.setTiposEntrega(response.data.tiposEntrega);
                InvoiceService.setPaises(response.data.paises);
                InvoiceService.setTiposDocumento(response.data.tiposDocumento);

                self.invoice = InvoiceService.getInvoice();

                self.pedido.moneda = response.data.monedas[1];
                self.pedido.fecha = response.data.fecha;
                self.pedido.documento = response.data.documento;
                self.pedido.almacen = response.data.almacenes[0];
                self.pedido.pedidoGenerar = response.data.pedidosGenerar[0];
                self.pedido.formaPago = response.data.formasPago[0];
                self.pedido.tipoPedido = response.data.tiposPedido[0];
                self.pedido.tipoEntrega = response.data.tiposEntrega[0];
                self.pedido.pais = response.data.paises[168]; // La posición en el array del país Perú
                self.pedido.tipoDocumento = response.data.tiposDocumento[0];


                Materialize.toast(response.message, 2000);
            } else {
                Materialize.toast(response.message, 2000);
            }
        }, function (error) {
            // promise rejected, could log the error with: console.log('error', error);
            console.log('error', error);
        });


        /**
         * Configuramos el calendario
         */
        var currentTime = new Date();
        self.pedido.fechaEnvio = currentTime;
        self.month = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre',
            'Octubre', 'Noviembre', 'Diciembre'];
        self.monthShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        self.weekdaysFull = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        self.weekdaysLetter = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
        self.today = 'Hoy';
        self.clear = 'Limpiar';
        self.close = 'Cerrar';
        self.minDate = (new Date(currentTime.getTime())).toISOString();

        self.onStart = function () {
            console.log('onStart');
        };

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });


        /*
         * Inicializamos un nuevo pedido
         * OJO!!! DEBEMOS USAR EL GET PARA PODER AGREGAR LINES AL OBJETO PEDIDO, SI USAMOS EL "NEW" NO FUNCIONARÁ
         * AVERIGUAR A QUE SE DEBE LUEGO, OK
         */
        //self.pedido = PedidoService.new();
        self.pedido = PedidoService.getPedido();

        /**
         * Función que permite buscar un producto
         */
        self.buscarProducto = function (e) {
            e.preventDefault();
            // Instanciamos un nuevo Producto
            ProductoService.nuevo();
            ProductoService.setCodigo(self.producto.codigo);

            if (self.producto.codigo === '' || self.producto.codigo === null) {
                Materialize.toast("Debe ingresar el 'código' del producto", 3000);
                angular.element("#codigoProducto").focus();
            } else {

                // Variables a enviar a la consulta del producto
                var codigoP = self.producto.codigo;
                var monedaId = self.moneda.value;
                var almacenId = self.almacen.value;

                // Buscamos el producto según su código(value)
                ProductoService.buscar(codigoP, monedaId, almacenId).then(function (response) {
                    if (response.success === true || response.success === 1) {
                        // Mostramos el mensaje enviado por el servidor
                        Materialize.toast(response.message, 3000);
                        // Inicializamos los valores del producto obtenido
                        var unidadMedida = {
                            name: response.data.uomName,
                            value: response.data.cUomId
                        };
                        console.log(response.data);
                        ProductoService.setId(response.data.productId);
                        ProductoService.setName(response.data.name);
                        ProductoService.setPricelist(response.data.priceList);
                        ProductoService.setUom(unidadMedida);
                        ProductoService.setCodigo(response.data.value);
                        ProductoService.setStock(response.data.stock);
                        angular.element("#precioUnitarioProducto").focus();
                        // Guardamos la variable producto para luego ser agregada al Line del PedidoService
                        self.producto = ProductoService.getProducto();
                        console.log("Producto actual:");
                        console.log(self.producto);
                    } else {
                        Materialize.toast(response.message, 3000);
                        // Instanciamos un nuevo Producto
                        ProductoService.nuevo();
                        self.producto = ProductoService.getProducto();
                        angular.element("#codigoProducto").focus();
                    }

                }, function (error) {
                    // promise rejected, could log the error with: console.log('error', error);
                    console.log('error', error);
                });


            }

        };
        /*
         * Esta función nos permitirá calcular el subtotal del producto seleccionado
         */
        self.calcularSubtotal = function () {
            ProductoService.setCantidad(self.producto.cantidad);
            ProductoService.setPrecioUnitario(self.producto.precioUnitario);

            var subt = self.producto.cantidad * self.producto.precioUnitario;
            var subtotal = Math.round(subt * 1000) / 1000 + '';
            ProductoService.setSubtotal(subtotal.toString());
            self.producto = ProductoService.getProducto();
        };



        self.calcularDescuento = function () {
            var dscto = self.producto.descuento;
            var precioU = ((100 - dscto) * self.producto.pricelist) / 100;
            var precioUnitario = Math.round(precioU * 1000) / 1000;
            ProductoService.setPrecioUnitario(precioUnitario);
            self.calcularSubtotal();
        };

        self.montoDescuento = function () {
            var precioL = self.producto.pricelist;
            var precioU = self.producto.precioUnitario;
            var dscto = 100 - (precioU * 100) / precioL;

            if (dscto < 0) {
                dscto = 0.000;
            }
            var descuento = Math.round(dscto * 1000) / 1000;
            ProductoService.setDescuento(descuento);
            self.calcularSubtotal();
        };

        /**
         * Función que nos permite agregar un producto al pedido de venta
         */
        self.agregarProducto = function (codigo, ev) {
            ev.preventDefault();

            if (self.producto.codigo == '' || self.producto.subtotal == 0.000) {
                var message = "Complete todos los campos";
                Materialize.toast(message, 3000);
            } else {
                var pos = PedidoService.exists(codigo);
                if (pos === -1) {
                    // This product hasn't been added yet, so we proceed to add a new one.
                    console.log("producto no existe, agregaremos uno nuevo");
                    console.log(self.producto.id);
                    // Agregamos un orderline al array del pedido
                    PedidoService.addLine(self.producto);
                    self.pedido.lines = PedidoService.getLines();
                    console.log(self.pedido.lines);
                    // Instanciamos un nuevo producto
                    ProductoService.nuevo();
                    self.producto = ProductoService.getProducto();
                    // Calculamos el subtotal de todo el pedido
                    PedidoService.calcularMontos(self.IGV);
                } else {
                    // This product has been added already, so we proceed to update its info.
                    var message = "Procederemos a actualizar el producto";
                    console.log(self.producto);
                    Materialize.toast(message, 3000);
                    // Exists the product, so we proceed to replace its info into the orderline.
                    PedidoService.replaceLine(self.producto, pos);
                    self.pedido.lines = PedidoService.getLines();
                    console.log(self.pedido.lines);
                    // Instanciamos un nuevo producto
                    ProductoService.nuevo();
                    self.producto = ProductoService.getProducto();
                    // Calculamos el subtotal de todo el pedido
                    PedidoService.calcularMontos(self.IGV);
                }

            }

        };

        /*
         * Función para editar una línea del pedido de venta
         */
        self.editItemFromOrder = function (product, ev) {
            angular.element("#registrarNuevoPedido").find("li:first>.collapsible-header").addClass("active");
            // Creamos una nueva instancia del producto
            ProductoService.nuevo();
            // Guardamos los parámetros en el nuevo objeto Producto 
            // no enviar directamente el objeto, porque se pasará con el ID y 
            // lo que queremos es instanciar un nuevo producto con un ID único
            // NO HACER!!! ProductoService.setProducto(product);
            ProductoService.setCodigo(product.codigo);
            ProductoService.setId(product.id);
            ProductoService.setSubtotal(product.subtotal);
            ProductoService.setName(product.name);
            ProductoService.setUom(product.uom);
            ProductoService.setCantidad(product.cantidad);
            ProductoService.setDescuento(product.descuento);
            ProductoService.setPrecioUnitario(product.precioUnitario);
            ProductoService.setPricelist(product.pricelist);
            ProductoService.setStock(product.stock);

            self.producto = ProductoService.getProducto();

            console.log("editar producto");
            console.log(self.producto);

        };
        /*
         * Función para confirmar si desea eliminar un producto del pedido
         */

        self.confirmRemoveItem = function (codigo, ev) {
            ev.preventDefault();
            self.lineToRemove = codigo;

            $('#modalConfirmDeleteItem').openModal({
                dismissible: false, // Modal can be dismissed by clicking outside of the modal
                opacity: .5, // Opacity of modal background
                in_duration: 300, // Transition in duration
                out_duration: 200, // Transition out duration
                ready: function () {

                }, // Callback for Modal open
                complete: function () {

                } // Callback for Modal close
            });
        };

        self.removeLine = function (codigo) {
            var pos = PedidoService.exists(self.lineToRemove);
            PedidoService.deleteLine(pos);
            Materialize.toast('Línea removida correctamente', 2000);

        };


        /*
         * Esta función es llamada cuando se realiza un cambio en la forma de pago
         */
        self.cambioFormaPago = function (ev) {
            FormaPagoService.setFormaPago(self.formaPago);
            FormaPagoService.getNroDias().then(function (response) {
                if (response.success === true || response.success === 1) {
                    self.invoice.nroDias = response.data;
                    self.nroDias = response.data[0];
                } else {
                    Materialize.toast(response.message, 2000);
                }

            }, function (error) {
                // promise rejected, could log the error with: console.log('error', error);
                console.log('error', error);
            });
        };


        /**
         * Buscamos un cliente según su documento de identidad
         */
        self.buscarCliente = function (ev) {
            var codigo = self.cliente.taxid;
            ClienteService.buscar(codigo).then(function (response) {
                if (response.success === true || response.success === 1) {
                    Materialize.toast(response.message, 2000);
                    ClienteService.setId(response.data.cBPartnerId);
                    ClienteService.setIdentificador(response.data.value);
                    ClienteService.setTaxid(response.data.taxid);
                    ClienteService.setName(response.data.name);
                    ClienteService.setclienteAddressId(response.data.cBPartnerLocationId);
                    var direcccion = {
                        id: response.data.address.c_location_id,
                        address1: response.data.address.address1,
                        address2: response.data.address.address1,
                        city: response.data.address.city,
                        postal: response.data.address.postal,
                        region: {name: response.data.address.nombre_region, value: response.data.address.c_region_id},
                        country: {name: response.data.address.nombre_pais, value: response.data.address.c_country_id}
                    };
                    ClienteService.setAddress(direcccion);
                    self.cliente = ClienteService.getCliente();
                } else {
                    Materialize.toast(response.message, 2000);
                }
            }, function (error) {
                // promise rejected, could log the error with: console.log('error', error);
                console.log('error', error);
            });

        };


        /**
         * Función que es llamada cuando cambia de tipo de documento de identidad, en el cliente
         */
        self.cambiarDocumentoIdentidad = function (ev) {
            self.cambiarDocumento();
        };

        /*
         * Función que permite agregar un cliente
         */
        self.agregarCliente = function (ev, formValidate) {

            if (formValidate.$valid) {
                console.log("holas");
                ClienteService.setCliente(self.cliente);
                console.log(ClienteService.getCliente());
                ClienteService.setTipoDocumento(self.tipoDocumento);
                // Configuramos el objeto address
                var address = {
                    address1: '',
                    address2: '',
                    city: '',
                    postal: '',
                    region: {name: '', value: ''},
                    country: {name: '', value: ''}
                };
                ClienteService.setRegion(self.region);
                ClienteService.setCountry(self.pais);
                // Llamamos al método save del servicio Cliente
                ClienteService.save(self.nroDias.value, self.formaPago.value, self.moneda.value).then(function (response) {
                    if (response.success === true || response.success === 1) {
                        Materialize.toast(response.message, 2000);
                    } else {
                        Materialize.toast(response.message, 3000);
                    }
                });

            } else {
                Materialize.toast("Hay datos incorrectos, corríjalos por favor.", 3000);
                // Validate through TABS, a little bit hard, but not imposibble
                var elemInfoClient = angular.element("#infoCliente");
                var elemDireClient = angular.element("#direccionCliente");

                $('ul.tabs').tabs('select_tab', 'infoCliente');
                var wrongEmelement = angular.element("[name='" + formValidate.$name + "']").find('.ng-invalid:visible:first');
                if (elemInfoClient.find('#' + wrongEmelement.attr("id") + '').length > 0) {
                    console.log(elemInfoClient.find('#' + wrongEmelement.attr("id") + ''));
                    console.log('infoCliente' + wrongEmelement.attr("id"));
                    wrongEmelement.focus();
                    return false;
                }
                $('ul.tabs').tabs('select_tab', 'direccionCliente');
                wrongEmelement = angular.element("[name='" + formValidate.$name + "']").find('.ng-invalid:visible:first');
                if (elemDireClient.find('#' + wrongEmelement.attr("id") + '').length > 0) {
                    console.log(elemDireClient.find('#' + wrongEmelement.attr("id") + ''));
                    console.log('direccionCliente' + wrongEmelement.attr("id"));
                    wrongEmelement.focus();

                    return false;
                }
            }

        };


        /*
         * Función que permite listar las regiones o departamentos según el país
         */
        self.cambioPais = function () {
            var codigoP = self.pais.value;
            PaisesService.listarRegiones(codigoP).then(function (response) {
                if (response.success === true || response.success === 1) {
                    self.invoice.regiones = response.data;
                    self.region = response.data[0];
                } else {
                    self.invoice.regiones = [];
                    Materialize.toast(response.message, 2000);
                }
            });
        };


        /*
         * Función para GUARDAR EL PEDIDO DE VENTA
         */
        self.guardarPedidoVenta = function (ev) {
            // ev.preventDefault();
            PedidoService.nuevo();
            console.log(self.moneda);
            return;
            // PedidoService.setMoneda(self.moneda);
            PedidoService.setAlmacen(self.almacen);
            PedidoService.setFormaPago(self.formaPago);
            PedidoService.setNroDias(self.nroDias);
            PedidoService.setCliente(self.cliente);
            self.pedido = PedidoService.getPedido();
            console.log(self.pedido);
            console.log("Pedido de venta guardado con éxito");
            PedidoService.guardar().then(function (response) {
                if (response.success === true || response.success === 1) {
                    Materialize.toast(response.message, 2000);
                } else {
                    Materialize.toast(response.message, 2000);
                }
            }, function (error) {
                // promise rejected, could log the error with: console.log('error', error);
                console.log('error', error);
            });
        };



    }
]);



// Detalles de las lineas del pedido
pedidos.controller('NuevoPedidoDetalleController', ['$scope', '$stateParams', '$state',
    function ($scope, $stateParams, $state) {
        var self = this;




    }
]);

// Información del cliente del pedido
pedidos.controller('NuevoPedidoClienteController', ['$scope', '$state', '$timeout', '$stateParams', 'ProductoService',
    'PedidoService', 'InvoiceService', 'FormaPagoService', 'ClienteService', 'PaisesService',
    function ($scope, $state, $timeout, $stateParams, ProductoService, PedidoService, InvoiceService, FormaPagoService,
            ClienteService, PaisesService) {


        var self = this;

        /*
         * Variables para el dialogo del cliente
         */
        self.documentName = '';
        self.minCarac = 0;
        self.maxCarac = 0;

        /*
         * Validaciones para el número mínimo y máximo de caracteres según el docum. de identidad
         */
        self.cambiarDocumento = function () {
            console.log($scope.NP.pal);
            console.log($scope.NP.pal);
            var documento = $scope.NP.pedido;
            self.documentName = documento.tipoDocumento;
            console.log(documento);
            console.log(self.documentName);

            if (self.documentName.toUpperCase().indexOf('RUC') > -1) {
                self.minCarac = 11;
                self.maxCarac = 11;
            } else if (self.documentName.toUpperCase().indexOf('DNI') > -1) {
                self.minCarac = 8;
                self.maxCarac = 8;
            } else {
                self.minCarac = 1;
                self.maxCarac = 1;
            }
        };

        self.cambiarDocumento();

    }
]);

// Información general del pedido de venta
pedidos.controller('NuevoPedidoGeneralController', ['$scope', '$state', '$timeout', '$stateParams', 'ProductoService',
    'PedidoService', 'InvoiceService', 'FormaPagoService', 'ClienteService', 'PaisesService',
    function ($scope, $state, $timeout, $stateParams, ProductoService, PedidoService, InvoiceService, FormaPagoService,
            ClienteService, PaisesService) {
        var self = this;


    }
]);
