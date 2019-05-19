import * as dataHandler from "./dataHandler";
import {RequestData} from './requestData';
import {hash} from './helper'

// export default (function () {

function _checkProperty(property: string, payload: object, length: number = 0, fallBack: any = false) {
    if ((!payload[property]) || (payload[property].toString().trim().length < length)) {
        return fallBack;
    }
    let type = typeof payload[property];
    // Switch for future
    switch (type) {
        case "string":
            return (payload[property] as string).trim();
        default:
            return payload[property];
    }
}

export class UserPayload {
    firstName;
    lastName;
    phone;
    password;
    toSAgreement;

    constructor(payload: object) {
        this.firstName = _checkProperty('firstName', payload);
        this.lastName = _checkProperty('lastName', payload);
        this.phone = _checkProperty('phone', payload, 5);
        this.password = _checkProperty('password', payload, 8);
        this.toSAgreement = _checkProperty('toSAgreement', payload);
    }
}

export function users(data: RequestData, callback) {
    function _post() {
        let userPayload = new UserPayload(data.payload);
        if (!(userPayload.password && userPayload.lastName && userPayload.firstName && userPayload.password && userPayload.phone && userPayload.toSAgreement)) {
            return callback(400, "Missing Field(s)", "text");
        }

        let hashPassword = hash(userPayload.password);
        if (!hashPassword) {
            return callback(400, "Password hashing failed", 'text');
        }
        userPayload.password = hashPassword;
        dataHandler.checkPathAvaiable('user', userPayload.phone,)
            .then(() => dataHandler.create('user', userPayload.phone))
            .then((fd:number) => dataHandler.write(fd, JSON.stringify(userPayload)))
            .then((fd:number) => dataHandler.close(fd))
            .then(() => callback(200, 'File Created','text'))
            .catch((errorCode:number) => callback(400, dataHandler.errorObject[errorCode.toString()], "text"))
    }

    function _get(data:RequestData, callback) {
        if (!checkPhoneNumberExist(data.query['phone'])) return callback(400, 'Missing Phone Number', 'text');

        dataHandler.checkFileExists('user', (data.query['phone'] as string).trim())
            .then(() => dataHandler.readData('user', data.query['phone'].trim()))
            .then((data) => callback(200,JSON.stringify(data)))
            .catch((errorCode)=> callback(404, dataHandler.errorObject[errorCode.toString()], 'text'));
    }

    function _put(data:RequestData, callback) {
        //TODO authenticate
        if (!checkPhoneNumberExist(data.query['phone'])) return callback(400, 'Missing Phone Number', 'text');

        dataHandler.checkFileExists('user',data.query['phone'])
            .then(processPut)
            .catch(() => callback(400, "File does not exist!"));

        let userPayload = new UserPayload(data.payload);

        function processPut(){
            if (!(userPayload.password || userPayload.lastName || userPayload.firstName || userPayload.password || userPayload.phone || userPayload.toSAgreement)) {
                return callback(400, "Missing Field(s)", "text");
            }

            dataHandler.readData('user', data.query['phone'])
                .then((readData)=>{
                    let newData = new UserPayload(readData);
                    if (userPayload.password) newData.password = hash(userPayload.password);
                    if (userPayload.toSAgreement) newData.toSAgreement = userPayload.toSAgreement;
                    if (userPayload.lastName) newData.lastName = userPayload.lastName;
                    if (userPayload.firstName) newData.firstName = userPayload.firstName;

                    dataHandler.update('user',data.query['phone'],JSON.stringify(newData))
                        .then(() => callback(200, 'Data updated'))
                        .catch((errorCode) => callback(500, dataHandler.errorObject[errorCode.toString()]))
                })
                .catch(()=> callback(400, "Cannot read file"));

        }
    }

    function _delete() {
        if (!checkPhoneNumberExist(data.query['phone'])) return callback(400, 'Missing Phone Number', 'text');
        dataHandler.checkFileExists('user',data.query['phone'])
            .then(() => dataHandler.unlink('user', data.query['phone']))
            .then(() => callback(200, "File Deleted",'text'))
            .catch( (errorCode) => callback(500, dataHandler.errorObject[errorCode.toString()]))
    }

    function checkPhoneNumberExist(phoneNumber:string) {
        return (!((typeof (phoneNumber) != 'string') || (phoneNumber.trim().length == 0)));
    }

    const acceptableMethods = {
        'post': _post,
        'get': _get,
        'put': _put,
        'delete': _delete
    };

    acceptableMethods[data.method] ? acceptableMethods[data.method](data, callback) : callback(400, "Invalid Route");
}

export function ping(data, callback) {
    callback(200, "ping successful", "text")
}

export function notFound(data, callback) {
    callback(405);
}