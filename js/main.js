var vm = new Vue({
    el: '#petitioner',
    data: {
        request: { domain: '', url: '', method: 'GET', data: '', headers: [] },
        requestParams: [],
        requestHeaders: [],
        responseHeaders: [],
        responseBody: '',
        statusResponse: {status:'', statusText:''},
        newRequestParam: {nombre:'', valor:''},
        newRequestHeader: {nombre:'', valor:''},
        archivo: false,
        error: false,
        heightPetition: (screen.height*0.5),
        heightResponse: (screen.height*0.65)
    },
    methods: {
        addKey(isParam){
            var array = (isParam)? this.requestParams : this.requestHeaders;
            var newKey = (isParam)? this.newRequestParam : this.newRequestHeader;
            if(newKey.nombre === '' || newKey.valor === '')
                return false;
            array.push({ nombre: newKey.nombre, valor: newKey.valor, activado: true, focus: false });
            newKey.nombre = '';
            newKey.valor = '';
        },
        removeKey(isParam, i){
            var array = (isParam)? this.requestParams : this.requestHeaders;
            array.splice(i, 1);
        },
        getEstado(){
            return "Estado: " + this.statusResponse.status + " - " + this.statusResponse.statusText.toUpperCase();
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
        validarReqHeader(reqHeader) { return reqHeader.activado && reqHeader.nombre !== '' && reqHeader.valor !== ''; },
        enviarPeticion() {
            this.request.headers = [];
            this.requestHeaders.map((x) => { if (this.validarReqHeader(x)) { this.request.headers.push(x); } });
            this.sendHTTP();
        },
        sendHTTP(){
            const headerOBJ = {};
            this.request.headers.map((x) => { headerOBJ[x.nombre] = x.valor; });
            $.ajax({
                url: '' + this.request.domain + this.request.url,
                method: this.request.method,
                data: (this.request.method === 'GET')? '' : this.request.data,
                headers: headerOBJ,
                success: function(data, status, xhr){
                    this.error = false;
                    vm.setResponse(data, status, xhr);
                },
                error: function(data, status, xhr){
                    this.error = true;
                    vm.setResponse(data, status, xhr);
                }
            });
        },
        setResponse(data, status, xhr){
            this.responseHeaders = this.formatHeaders(xhr.getAllResponseHeaders());
            this.responseBody = xhr.responseText;
            var formatedText = $("<pre class='brush: html'></pre>");
            formatedText.html(this.responseBody.replace(/</g,"&lt;"));
            $("#responseText").html(formatedText);
            SyntaxHighlighter.highlight();
            $("#responseFrame").attr("srcdoc", this.responseBody);
            this.statusResponse.status = xhr.status;
            this.statusResponse.statusText = xhr.statusText;
        },
        formatHeaders(text){
            var headers = {};
                text.split('\u000d\u000a').forEach((line) => {
                    if (line.length > 0)
                    {
                        var delimiter = '\u003a\u0020',
                        header = line.split(delimiter);
                        headers[header.shift().toLowerCase()] = header.join(delimiter);
                    }
                });
            return headers;
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