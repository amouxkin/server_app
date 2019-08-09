import * as dataHandler from "../dataHandler";
import {hash,checkProperty, checkPhoneNumberExist, verifyToken} from "../helper";
import * as config from '../config';

import {UserData} from '../object/userData';
import {TokenData} from '../object/tokenData';
import {RequestData} from '../object/requestData';
import {CheckerRequestHeader} from '../object/checkerRequestData'


export function users(data: RequestData, callback) {
    function _post() {
        let userPayload = new UserData(data.payload);
        if (!(userPayload.password && userPayload.lastName && userPayload.firstName && userPayload.password && userPayload.phone && userPayload.toSAgreement)) {
            return callback(400, dataHandler.errorObject["51"], "text");
        }

        if (!userPayload.password) return callback(400, dataHandler.errorObject["50"], 'text');

        dataHandler.checkPathAvaiable('users', userPayload.phone,)
            .then(() => dataHandler.create('users', userPayload.phone))
            .then((fd:number) => dataHandler.write(fd, JSON.stringify(userPayload)))
            .then((fd:number) => dataHandler.close(fd))
            .then(() => callback(200, 'File Created','text'))
            .catch((errorCode:number) => callback(400, dataHandler.errorObject[`${errorCode}`], "text"))
    }

    function _get(data:RequestData, callback) {
        if (!checkPhoneNumberExist(data.query['phone'])) return callback(400, dataHandler.errorObject["20"], 'text');

        verifyToken(data.header['id'], data.header['phone'])
            .then(() => dataHandler.checkFileExists('users', (data.query['phone'] as string).trim()))
            .then(() => dataHandler.readData('users', data.query['phone'].trim()))
            .then((data) => callback(200,JSON.stringify(data)))
            .catch((errorCode)=> callback(404, dataHandler.errorObject[`${errorCode}`], 'text'));
    }

    function _put(data:RequestData, callback) {
        if (!checkPhoneNumberExist(data.query['phone'])) return callback(400, dataHandler.errorObject["20"], 'text');

        verifyToken(data.header['id'], data.header['phone'])
            .then(()=> dataHandler.checkFileExists('users',data.query['phone']))
            .then(processPut)
            .catch((errorCode) => callback(400, dataHandler.errorObject[`${errorCode}`]));

        function processPut(){
            let userPayload = new UserData(data.payload);
            if (!(userPayload.password || userPayload.lastName || userPayload.firstName || userPayload.password || userPayload.phone || userPayload.toSAgreement)) {
                return callback(400, dataHandler.errorObject["51"], "text");
            }

            dataHandler.readData('users', data.query['phone'])
                .then((readData)=>{
                    let newData = new UserData(readData);
                    if (userPayload.password) newData.password = hash(userPayload.password);
                    if (userPayload.toSAgreement) newData.toSAgreement = userPayload.toSAgreement;
                    if (userPayload.lastName) newData.lastName = userPayload.lastName;
                    if (userPayload.firstName) newData.firstName = userPayload.firstName;

                    dataHandler.update('users',data.query['phone'],JSON.stringify(newData))
                        .then(() => callback(200, 'Data updated'))
                        .catch((errorCode) => callback(500, dataHandler.errorObject[`${errorCode}`]))
                })
                .catch(()=> callback(400, dataHandler.errorObject["4"]));
        }
    }

    function _delete() {
        if (!checkPhoneNumberExist(data.query['phone'])) return callback(400, dataHandler.errorObject["20"], 'text');

        verifyToken(data.header['id'], data.header['phone'])
            .then(()=> dataHandler.checkFileExists('users',data.query['phone']))
            .then(() => dataHandler.unlink('users', data.query['phone']))
            .then(() => callback(200, "File Deleted",'text'))
            .catch( (errorCode) => callback(500, dataHandler.errorObject[`${errorCode}`]))
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
    callback(200, "ping successful", "text");
}

export function notFound(data, callback) {
    callback(405);
}

export function tokens(data: RequestData, callback) {
    const acceptableMethods = {
        'post': _post,
        'get': _get,
        'put': _put,
        'delete': _delete
    };

    function _post(){
        let userPayload = new UserData(data.payload);
        if (!userPayload.phone || !userPayload.password ){
            return callback(200, dataHandler.errorObject["51"], "text");
        }

        dataHandler.read('users',userPayload.phone)
            .then( function(readData:string){
                let userData = new UserData(JSON.parse(readData), false );
                if (userPayload.password != userData.password){
                    return Promise.reject(12);
                }
                let token = new TokenData(userData.phone);
                //return Promise.resolve(new TokenData(userData.phone));
                dataHandler.checkPathAvaiable("tokens",token.id)
                    .then(() => dataHandler.create('tokens', token.id))
                    .then((fd:number) => dataHandler.write(fd, JSON.stringify(token)))
                    .then((fd:number) => dataHandler.close(fd))
                    .then(() => callback(200, JSON.stringify(token)))
            })
            .catch((errorCode) => callback(500, dataHandler.errorObject[`${errorCode}`],'text'));
    }

    function _get(){
        if (!checkProperty('id', data.query)) return callback(400, 'Missing Token id', 'text');
        verifyToken(data.header['id'], data.header['phone'])
            .then(()=> dataHandler.checkFileExists('tokens', data.query['id'].trim()))
            .then(() => dataHandler.readData('tokens', data.query['id'].trim()))
            .then((data) => callback(200,JSON.stringify(data)))
            .catch((errorCode)=> callback(404, dataHandler.errorObject[`${errorCode}`], 'text'));

    }

    function _put(){
        if ((typeof (data.payload['id']) != 'string') || !(data.payload['extend'])) return callback(400, "Error : Missing required field(s) or field(s) are invalid");

        verifyToken(data.header['id'], data.header['phone'])
            .then(() => dataHandler.checkFileExists("tokens", data.payload['id']))
            .then(() => dataHandler.readData("tokens", data.payload['id'],))
            .then(function(readData:TokenData){
                if (readData.expires > Date.now()) return callback(400, dataHandler.errorObject["14"]);
                readData.expires = Date.now() + 1000 * 60 * 60;
                return Promise.resolve(readData);
            })
            .then((readData:TokenData) => dataHandler.update("tokens", readData.id, JSON.stringify(readData)))
            .then(() => callback(200))
            .catch((errorCode) => callback(500, dataHandler.errorObject[`${errorCode}`]))
        ;
    }

    function _delete(){
        if (!(data.query['id'])) return callback(400, 'Missing required field(s) or field(s) are invalid', 'text');

        dataHandler.checkFileExists("tokens", data.payload['id'])
            .then(() => dataHandler.checkFileExists('tokens',data.query['id']))
            .then(() => dataHandler.unlink('tokens', data.query['id']))
            .then(() => callback(200, "Token Deleted",'text'))
            .catch( (errorCode) => callback(500, dataHandler.errorObject[`${errorCode}`], "text"))
    }
    acceptableMethods[data.method] ? acceptableMethods[data.method](data, callback) : callback(400, "Invalid Route");
}

export function checks(data: RequestData, callback) {
    const acceptableMethods = {
        'post': _post,
        // 'get': _get,
        // 'put': _put,
        // 'delete': _delete
    };

    function _post(){
        let requestData = new CheckerRequestHeader(data.header);
        verifyToken(requestData.id, requestData.phone)
            .then(()=> dataHandler.read('users',requestData.phone))
            .then((userData:UserData) =>  userData.checks ? Promise.resolve(userData.checks) : Promise.reject(15))
            .then((checks:Array<string>) => checks.length < config.environment.maxChecks ? Promise.resolve(checks) :  Promise.reject(16))
            // .then((checks:Array<string>) => )
            .catch((errorCode) => callback(500, dataHandler.errorObject[`${errorCode}`], "text"));
        console.log(requestData);
    }

    acceptableMethods[data.method] ? acceptableMethods[data.method](data, callback) : callback(405);


}