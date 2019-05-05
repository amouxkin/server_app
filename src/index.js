"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const string_decoder_1 = require("string_decoder");
const url = require("url");
const stringDecoder = new string_decoder_1.StringDecoder("utf-8");
const server = http.createServer(initializeServer);
server.listen(3000);
function initializeServer(request, response) {
    let buffer = '';
    request.on("data", (data) => buffer += stringDecoder.write(data));
    request.on("end", requestProcess);
    function requestProcess() {
        buffer += stringDecoder.end();
        let requestedData = new RequestData(request, buffer);
        (router[requestedData.routerArray[0]] || router.notFound)(requestedData, responseWriter);
        function responseWriter(responseCode) {
            response.writeHead(responseCode, { "Content-Type": "application/json" });
            response.write("Hello World");
            response.end();
        }
    }
}
const router = {
    ping: (data, callback) => callback(200),
    notFound: (data, callback) => callback(400)
};
class RequestData {
    constructor(request, buffer) {
        this.method = request.method.toLowerCase();
        this.payload = JSON.parse(buffer) || {};
        this.routerArray = url.parse(request.url, true).path.slice(1).split('/');
    }
}
//# sourceMappingURL=index.js.map