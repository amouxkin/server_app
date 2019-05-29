export class CheckerRequestHeader {
    id:string;
    phone:string;
    protocol:string;
    constructor(requestHeader:object){
        this.id = requestHeader['id'];
        this.phone = requestHeader['phone'];
        this.protocol = (['http','https'].indexOf(requestHeader['protocol']) > -1) && requestHeader['protocol'];
    }
}