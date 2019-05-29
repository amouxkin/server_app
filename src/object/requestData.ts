import * as http from "http";
import * as url from "url";

export class RequestData {
    method:string;
    payload:object;
    header:object;
    query:object;
    pathName:string;
    constructor(request:http.IncomingMessage, jsonObject:object){
        let parsedUrl = url.parse(request.url, true);
        this.method = request.method.toLowerCase();
        this.header = request.headers || {};
        this.payload = jsonObject || {};
        this.query = parsedUrl.query || {};
        this.pathName = parsedUrl.pathname.substr(1);
    }
}