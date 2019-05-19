import * as http from "http";
import * as url from "url";
import {ParsedUrlQuery} from "querystring";
import {URL} from "url";

export class RequestData {
    method:string;
    payload:object;
    query:object;
    pathName:string;
    constructor(request:http.IncomingMessage, jsonObject:object){
        let parsedUrl = url.parse(request.url, true);
        this.method = request.method.toLowerCase();
        this.payload = jsonObject || {};
        this.query = parsedUrl.query || {};
        this.pathName = parsedUrl.pathname.substr(1);
    }
}