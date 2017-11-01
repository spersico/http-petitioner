var vm = new Vue({
    el: '#petitioner',
    data: {
        request: { domain: '', url: '', method: 'GET', data: '', headers: [] },
        requestHeaders: [],
        resBody: '',
        responseHeaders: [],
        error: false,
        archivo: false,
        height: (screen.height*0.5),
        newRequestHeader: {nombre:'', valor:''}
    },
    methods: {
        crearHeaderReq() {
            if(this.newRequestHeader.nombre === '' || this.newRequestHeader.valor === '')
                return false;
            this.requestHeaders.push({ nombre: this.newRequestHeader.nombre, valor: this.newRequestHeader.valor, activado: true, focus: false });
            this.newRequestHeader.nombre = '';
            this.newRequestHeader.valor = '';
        },
        borrarHeaderReq(i) {
            this.requestHeaders.splice(i, 1);
        },
        cargarArchivo(evento) {
            this.archivo = true;
            this.request.data = evento.target.files[0];
            console.log(this.request.data);
        },
        borrarArchivo() {
            $("#inputArchivo").val('');
            this.request.data = '';
            this.archivo = false;
        },
        limpiarValorHeaderReq(i) { this.requestHeaders[i].valor = '' },
        validarReqHeader(reqHeader) { return reqHeader.activado && reqHeader.nombre !== '' && reqHeader.valor !== ''; },
        validarDatos() {
            this.request.headers = [];
            this.requestHeaders.map((x) => { if (this.validarReqHeader(x)) { this.request.headers.push(x) } })
            if (this.request.domain.length > 0 || this.request.url.length > 0) {
                if (this.request.domain[this.request.domain.length - 1] !== '/' && this.request.url[0] !== '/') {
                    this.request.domain += '/';
                }
                this.testHarcodeados();
                this.realizarPeticion();
            }
        },
        realizarPeticion() {
            const headerOBJ = {};
            this.request.headers.map((x) => { headerOBJ[x.nombre] = x.valor });

            $.ajax({
                url: '' + this.request.domain + this.request.url,
                method: this.request.method,
                data: this.request.data,
                headers: headerOBJ,
                success: (data) => {
                    this.resBody = JSON.stringify(data).split(",").join(",\n");
                },
                error: (data) => {
                    this.resBody = JSON.stringify(data);
                },
            });
        },
        esJsonString(txt) {
            try { JSON.parse(txt); }
            catch (e) { return false; }
            return true;
        },
        testHarcodeados() {
            if (this.request.domain === 'test/') {
                this.request.domain = 'https://api.odonpad.com/api/';
                this.request.url = 'prestaciones';
                this.request.headers = [
                    { nombre: 'Content-Type', valor: 'application/json', activado: true },
                    { nombre: 'Clinica', valor: '59a59c88eac39554ef4de8ef', activado: true },
                    { nombre: 'Authorization', valor: 'Ugbh6mHSgx7d3So6IlhEY6usvHJcPf4ECI9Y0zrrHVGbzxXs6e0CtOSWU3hQFaqR', activado: true }];
                this.requestHeaders = this.request.headers;
            }
            if (this.request.domain === 'testpost/') {
                this.request.domain = 'https://api.odonpad.com/api/';
                this.request.url = 'prestaciones';
                this.request.data = JSON.stringify(
                    {
                        "codigo": "pruebasHTTPSanti",
                        "nombre": "pruebasHTTPSanti",
                        "clinicaId": "59a59c88eac39554ef4de8ef",
                        "capituloId": "58d194cf24643f1a3851fa25",
                        "prestacionGenericaId": "58d1954c24643f1a3851fa27"
                    });
                this.request.headers = [
                    { nombre: 'Content-Type', valor: 'application/json', activado: true },
                    { nombre: 'Clinica', valor: '59a59c88eac39554ef4de8ef', activado: true },
                    { nombre: 'Authorization', valor: 'Ugbh6mHSgx7d3So6IlhEY6usvHJcPf4ECI9Y0zrrHVGbzxXs6e0CtOSWU3hQFaqR', activado: true }];
                this.requestHeaders = this.request.headers;
            }
        }
    }
})