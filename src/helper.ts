import * as crypto from 'crypto';
import {environment} from './config';
import * as dataHandler from "./dataHandler";

export function hash(str:string) {
    if(str.trim().length == 0) return null;
    return  crypto.createHmac('sha256', environment.hashingSecret).update(str).digest('hex') || null;
}

export function randomString(length:number) {
    if (typeof (length) != 'number' || length <= 0 || !Number.isInteger(length)) return randomString(8);
    return crypto.randomBytes(length).toString('hex').substring(0,length-1);
}

export function checkProperty(property: string, payload: object, length: number = 0, fallBack: any = null) {
    if ((payload == null) || (!payload[property]) ||
        (payload[property].toString().trim().length < length)) return fallBack;

    let type = typeof payload[property];
    // Switch for future
    switch (type) {
        case "string":
            return (payload[property] as string).trim();
        case "object":
            return payload[property];
        default:
            return payload[property];
    }
}

export function checkPropertyHash(property:string, payload:object, length:number = 8, fallBack:any = null) {
    if ((!payload[property]) || (payload[property].toString().trim().length < length) || typeof (payload[property]) != 'string') {
        return fallBack;
    }
    return hash((payload[property] as string).trim());
}

export function checkPhoneNumberExist(phoneNumber:string) {
    return (!((typeof (phoneNumber) != 'string') || (phoneNumber.trim().length == 0)));
}

export function verifyToken(id:string, phone:string) {
    return new Promise(function(resolve, reject){
        dataHandler.checkFileExists("tokens", id)
            .then(() => dataHandler.readData("tokens", id))
            .then(function (data) {
                if (data['phone'] != phone && data['expires'] < Date.now()) reject(13);
                return resolve();
            })
            .catch((errorCode) =>  reject(errorCode || 13))
    });
}