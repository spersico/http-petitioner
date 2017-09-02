
var vm = new Vue({
    el: '#petitioner',
    data: {
        request: { domain: '', url: '', method: 'GET', data: '', headers: [] },
        requestHeaders: [{ nombre: '', valor: '', activado: true }],
        resBody: '',
        responseHeaders: []
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
                if (this.request.domain === 'test/') { this.request.domain = './LICENSE' }
                $.ajax({
                    url: '' + this.request.domain + this.request.url,
                    method: this.request.method,
                    success: (data) => {
                        this.resBody = data;
                    },
                    error: (data) => {
                        this.resBody = data;
                    },
                });
            }

        }
    }
})

function AJAXrequest() {
    $.ajax()({
        type: type,
        url: url,
        data: reqData,
        dataType: 'json',
        success: callback
    });
}