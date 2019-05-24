import * as crypto from 'crypto';
import {environment} from './config';

export function hash(str:string) {
    if(str.trim().length == 0) return false;
    return  crypto.createHmac('sha256', environment.hashingSecret).update(str).digest('hex') || false;
}

export function randomString(length:number) {
    if (typeof (length) != 'number' || length <= 0 || !Number.isInteger(length)) return randomString(8);
    return crypto.randomBytes(length).toString('hex').substring(0,length-1);
}