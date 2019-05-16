import * as dataHandler from "./dataHandler";
import {RequestData} from './requestData';

// export default (function () {

function _checkProperty(property:string, payload:object, length:number = 0, fallBack:any = false){
    if ((!payload[property]) || (payload[property].toString().trim().length < length)  ) {
        return fallBack;
    }
    let type = typeof payload[property];
    switch (type) {
        case "string": return (payload[property] as string).trim();
        default: return payload[property];
    }
}
   export class UserPayload{
        firstName;
        lastName;
        phone;
        password;
        toSAgreement;
        constructor(payload:object){
            this.firstName = _checkProperty('firstName',payload) ;
            this.lastName = _checkProperty('lastName',payload) ;
            this.phone = _checkProperty('phone',payload,5) ;
            this.password = _checkProperty('password', payload,8) ;
            this.toSAgreement = _checkProperty('toSAgreement',payload) ;
        }
    }


    export function users(data:RequestData, callback) {
        function _post() {
            let userPayload = new UserPayload(data.payload);
            if( !(userPayload.password && userPayload.lastName && userPayload.firstName && userPayload.password && userPayload.phone && userPayload.toSAgreement)){
                callback(400, "Missing Field(s)", "text");
            }
            dataHandler.check('test',userPayload.phone,).catch(callback(400, "Error : User with that phone number exists.","text"));
        }

        function _get() {

        }

        function _put() {

        }

        function _delete() {

        }
        const acceptableMethods = {
            'post' : _post,
            'get' : _get,
            'put' : _put,
            'delete' : _delete
        };

        acceptableMethods[data.method] ? acceptableMethods[data.method](data,callback)  : callback(400, "Invalid Route");
    }

    export function ping(data, callback) {callback(200,"ping successful","text")}

    export function notFound(data, callback) {
        callback(405);
    }


//     return {
//         ping : (data, callback)=> callback(200,"ping successful","text"),
//         notFound : (data, callback) => callback(400),
//         users: _users
//     };
// })();