
var vm = new Vue({
    el: '#petitioner',
    data: {
        request: { domain: '', url: '', method: 'GET', data: '', headers: [] },
        requestHeaders: [{ nombre: '', valor: '', activado: true }],
        resBody: '',
        responseHeaders: [],
        error: false,
    },
    methods: {
        crearHeaderReq() { this.requestHeaders.push({ nombre: '', valor: '', activado: true }); },
        borrarHeaderReq(i) {
            this.requestHeaders.splice(i, 1);
            if (this.requestHeaders.length === 0) {
                this.crearHeaderReq();
            }
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
                if (this.request.domain === 'test/') {
                    this.request.domain = 'http://localhost:3000/api/';
                    this.request.url = 'prestaciones';
                    this.request.headers = [
                        { nombre: 'Content-Type', valor: 'application/json', activado: true },
                        { nombre: 'Clinica', valor: '58eecc0ae5009321d21d8561', activado: true },
                        { nombre: 'Authorization', valor: 'FuNEwmxN7VG7sqJiODtwApXGPy1RTpcJYvYcNZGnWF5oMnYMNKaIrTCiX2DOe5K6', activado: true }];
                    this.requestHeaders = this.request.headers;
                }
                if (this.request.domain === 'testpost/') {
                    this.request.domain = 'http://localhost:3000/api/';
                    this.request.url = 'prestaciones';
                    this.request.data = JSON.stringify(
                        { "codigo": "pruebasHTTPSanti", 
                        "nombre": "pruebasHTTPSanti", 
                        "clinicaId": "58eecc0ae5009321d21d8561", 
                        "capituloId": "58d194cf24643f1a3851fa25", 
                        "prestacionGenericaId": "58d1954c24643f1a3851fa27" });
                    this.request.headers = [
                        { nombre: 'Content-Type', valor: 'application/json', activado: true },
                        { nombre: 'Clinica', valor: '58eecc0ae5009321d21d8561', activado: true },
                        { nombre: 'Authorization', valor: 'FuNEwmxN7VG7sqJiODtwApXGPy1RTpcJYvYcNZGnWF5oMnYMNKaIrTCiX2DOe5K6', activado: true }];
                    this.requestHeaders = this.request.headers;
                }
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
        }
    }
})