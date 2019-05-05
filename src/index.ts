import * as http from 'http';
import {StringDecoder} from 'string_decoder';
import * as url from 'url';

const stringDecoder = new StringDecoder("utf-8");

const server:http.Server = http.createServer(initializeServer);
server.listen(3000);

function initializeServer(request:http.IncomingMessage, response:http.ServerResponse){
    let buffer = '';
    request.on("data",(data) => buffer += stringDecoder.write(data) );
    request.on("end", requestProcess);

    function requestProcess() {
        buffer += stringDecoder.end();
        let requestedData = new RequestData(request, buffer);
        (router[requestedData.routerArray[0]] || router.notFound)(requestedData, responseWriter);

        function responseWriter(responseCode:number){
            response.writeHead(responseCode,{"Content-Type" : "application/json"});
            response.write("Hello World");
            response.end();
        }
    }
}

const router = {
    ping : (data, callback)=> callback(200),
    notFound : (data, callback) => callback(400)
};

class RequestData {
    method:string;
    payload:object;
    routerArray:string[];

    constructor(request:http.IncomingMessage, buffer:string){
        this.method = request.method.toLowerCase();
        this.payload = JSON.parse(buffer) || {};
        this.routerArray = url.parse(request.url, true).path.slice(1).split('/');
    }
}