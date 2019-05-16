import * as http from "http";
import * as url from "url";

export class RequestData {
    method:string;
    payload:object;
    routerArray:string[];

    constructor(request:http.IncomingMessage, jsonObject:object){
        this.method = request.method.toLowerCase();
        this.payload = jsonObject || {};
        this.routerArray = url.parse(request.url, true).path.slice(1).split('/');
    }
}