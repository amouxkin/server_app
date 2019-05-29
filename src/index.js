"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const string_decoder_1 = require("string_decoder");
const router = require("./router/router");
const requestData_1 = require("./object/requestData");
const config_1 = require("./config");
const stringDecoder = new string_decoder_1.StringDecoder("utf-8");
const server = http.createServer(initializeServer);
server.listen(config_1.environment.httpPort);
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
            //console.log(e);
            if (buffer) {
                return responseWriter(400, "Invalid Json", "text");
            }
            else {
                jsonObject = {};
            }
        }
        let requestedData = new requestData_1.RequestData(request, jsonObject);
        (router[requestedData.pathName] || router.notFound)(requestedData, responseWriter);
        function responseWriter(responseCode, returnString, contentType = "application/json") {
            response.writeHead(responseCode, { "Content-Type": contentType });
            response.write(returnString || "Nothing to return");
            response.end();
        }
    }
}
//# sourceMappingURL=index.js.map