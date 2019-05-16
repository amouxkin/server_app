"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const string_decoder_1 = require("string_decoder");
const router = require("./router");
const requestData_1 = require("./requestData");
const config_js_1 = require("./config.js");
const stringDecoder = new string_decoder_1.StringDecoder("utf-8");
const server = http.createServer(initializeServer);
server.listen(config_js_1.environment.httpPort);
function initializeServer(request, response) {
    let buffer = '';
    request.on("data", (data) => buffer += stringDecoder.write(data));
    request.on("end", requestProcess);
    function requestProcess() {
        buffer += stringDecoder.end();
        let jsonObject;
        try {
            jsonObject = JSON.parse(buffer);
        }
        catch (e) {
            console.log(e);
            return responseWriter(400, "Invalid Json", "text");
        }
        let requestedData = new requestData_1.RequestData(request, jsonObject);
        (router[requestedData.routerArray[0]] || router.notFound)(requestedData, responseWriter);
        function responseWriter(responseCode, returnString, contentType = "application/json") {
            response.writeHead(responseCode, { "Content-Type": contentType });
            response.write(returnString || "Nothing to return");
            response.end();
        }
    }
}
//# sourceMappingURL=index.js.map