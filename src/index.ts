import * as http from 'http';
import {StringDecoder} from 'string_decoder';
import * as router from './router';
import {RequestData} from './requestData';
import {environment} from "./config";


const stringDecoder = new StringDecoder("utf-8");

const server:http.Server = http.createServer(initializeServer);
server.listen(environment.httpPort);

function initializeServer(request:http.IncomingMessage, response:http.ServerResponse){
    let buffer = '';
    request.on("data",(data) => buffer += stringDecoder.write(data) );
    request.on("end", requestProcess);

    function requestProcess() {
        buffer += stringDecoder.end();

        let jsonObject;

        try {
            jsonObject = JSON.parse(buffer);
        } catch (e) {
            //console.log(e);
            if (buffer){
                return responseWriter(400,"Invalid Json", "text");
            } else {
                jsonObject = {};
            }
        }

        let requestedData = new RequestData(request, jsonObject);
        (router[requestedData.pathName] || router.notFound)(requestedData, responseWriter);
        function responseWriter(responseCode:number, returnString:string, contentType:string = "application/json"){
            response.writeHead(responseCode,{"Content-Type" : contentType});
            response.write(returnString || "Nothing to return");
            response.end();
        }
    }
}