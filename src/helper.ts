import * as crypto from 'crypto';
import {environment} from './config';

export function hash(str:string) {
    if(str.trim().length == 0) return false;
    return  crypto.createHmac('sha256', environment.hashingSecret).update(str).digest('hex') || false;
}