import {randomString} from '../helper'

export class TokenData{
    phone:string;
    id:string;
    expires:number;
    constructor(phoneNumber:string, expires:number = (Date.now() + 1000 * 60 * 60)) {
        this.phone = phoneNumber;
        this.expires = expires;
        this.id = randomString(20);
    }
}