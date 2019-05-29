import {checkProperty, checkPropertyHash} from "../helper";

export class UserData {
    firstName:string;
    lastName:string;
    phone:string;
    password:string;
    toSAgreement:boolean;
    checks:Array<string>;

    constructor(payload: object, hashPassword:boolean = true) {
        this.firstName = checkProperty('firstName', payload);
        this.lastName = checkProperty('lastName', payload);
        this.phone = checkProperty('phone', payload, 5);
        this.password = hashPassword ? checkPropertyHash('password', payload, 8) : checkProperty('password', payload, 8);
        this.toSAgreement = checkProperty('toSAgreement', payload);
        this.checks = payload['checks'] instanceof Array && payload['checks'];
    }
}