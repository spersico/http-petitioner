var vm = new Vue({
    el: '#petitioner',
    data: {
        request: { domain: '', url: '', method: 'GET', data: '', params: [], headers: [] },
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
        heightResponse: (screen.height*0.65),
        cargando: null
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
            if(this.request.domain === '')
            {
                alert("Ingrese un dominio");
                return;
            }
            this.request.params = [];
            this.request.headers = [];
            this.requestParams.map((x) => { if (this.validarReqHeader(x)) { this.request.params.push(x); }});
            this.requestHeaders.map((x) => { if (this.validarReqHeader(x)) { this.request.headers.push(x); }}) ;
            this.sendHTTP();
        },
        sendHTTP(){
            const headerOBJ = {};
            this.request.headers.map((x) => { headerOBJ[x.nombre] = x.valor; });
            $.ajax({
                url: this.generarURL(),
                method: this.request.method,
                data: (this.request.method === 'GET')? '' : this.request.data,
                headers: headerOBJ,
                success: function(data, status, xhr){
                    vm.error = false;
                    vm.setResponse(data, status, xhr);
                },
                error: function(xhr, status, error){
                    vm.error = true;
                    vm.setResponse(error, status, xhr);
                }
            });
        },
        setResponse(data, status, xhr){
            this.responseHeaders = this.formatHeaders(xhr.getAllResponseHeaders());
            this.responseBody = xhr.responseText;
            this.statusResponse.status = xhr.status;
            this.statusResponse.statusText = xhr.statusText;
            var formatedText = $("<pre class='brush: html'></pre>");
            if(this.responseBody !== undefined)
            {
                formatedText.html(this.responseBody.replace(/</g,"&lt;"));
                $("#responseText").html(formatedText);
                SyntaxHighlighter.highlight();
                $("#responseFrame").attr("srcdoc", this.responseBody);
            }
            else
            {
                $("#responseText").html("");
                $("#responseFrame").attr("srcdoc", "");
            }
            
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
        getString(object){
            var string = "";
            object.map((x) => { string = string + x.nombre + "=" +  x.valor + "&"; });
            if(string !== "")
                string = string.slice(0, -1);
            return string;
        },
        generarURL(){
            var domain = this.request.domain;
            var url = this.request.url;
            var params = this.request.params;
            console.log(params);
            var paramsString = this.getString(params);
            var ret = domain;
            if(url !== "")
                ret = ret + "\\" + url;
            if(paramsString !== "")
                ret = ret + "?" + paramsString;
            return ret;
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