import * as fs from 'fs';
import * as path from 'path';

// export default (function () {
    const baseDir = path.join(__dirname, '/../data/');

    export function create(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
                fs.open(baseDir + path + "/" + fileName + "." + type, "wx", function (error, fileDescriptor) {
                    error ? reject(2) : resolve(fileDescriptor);
                });
            }
        );
    }

    export function write(fileDescriptor: number, stringData: string) {
        return new Promise(function (resolve, reject) {
                fs.writeFile(fileDescriptor, stringData, function (error) {
                    error ? reject(3) : resolve(fileDescriptor);
                });
            }
        );
    }

    export function close(fileDescriptor: number) {
        return new Promise(function (resolve, reject) {
            fs.close(fileDescriptor, function (error) {
                error ? reject(6) : resolve();
            });
        });
    }

    export function read(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.readFile(baseDir + path + "/" + fileName + "." + type, 'utf8', function (error, data) {
                error ? reject(4) : resolve(data);
            })
        });
    }

    export function readData(path:string, fileName:string, type:string = 'json') {
        return new Promise(function (resolve,reject) {
            read(path, fileName, type)
                .then((data:string)=>{
                    if ((data == null) || (data.toString().trim().length == 0)){
                        return reject(11);
                    } else {
                        data  = JSON.parse(data);
                        delete data['password'];
                        resolve(data);
                    }
                });
        });
    }

    export function open(path: string, fileName: string, type: string = "json",) {
        return new Promise(function (resolve, reject) {
            fs.open(baseDir + path + "/" + fileName + "." + type, "r+", function (error, fileDescriptor) {
                error ? reject(5) : resolve(fileDescriptor);
            });
        });
    }

    export function update(path: string, fileName: string, dataString: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.appendFile(baseDir + path + "/" + fileName + "." + type, dataString, {flag: "w+"}, function (error) {
                error ? reject(7) : resolve();
            })
        });
    }

    export function checkPathAvaiable(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.stat(baseDir + path + "/" + fileName + "." + type, function (error, stats) {
                !error ? reject(1) : resolve(baseDir + path + "/" + fileName + "." + type);
            })
        });
    }

    export function checkFileExists(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.stat(baseDir + path + "/" + fileName + "." + type, function (error, stats) {
                error ? reject(10) : resolve(baseDir + path + "/" + fileName + "." + type);
            })
        });
    }

    export function append(path: string, dataString: string) {
        return new Promise(function (resolve, reject) {
            fs.appendFile(path, dataString, function (error) {
                error ? reject(8) : resolve();
            });
        });
    }

    export function unlink(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.unlink(baseDir + path + "/" + fileName + "." + type, function (error) {
                error ? reject(9) : resolve();
            });
        });
    }

    export let errorObject = {
        1 : 'Error : User with the phone number exists',
        2 : 'Error : Cannot create file',
        3 : 'Error : Cannot write file',
        4 : 'Error : Cannot read file',
        5 : 'Error : Cannot open file',
        6 : 'Error : Cannot close file',
        7 : 'Error : Cannot update file',
        8 : 'Error : Cannot append file',
        9 : 'Error : Cannot Delete file',
        10 : 'Error : File does not exist',
        11 : 'Error : Empty file'
    };
    //
    // return {
    //     create: create,
    //     open: open,
    //     read: read,
    //     write: write,
    //     update: update,
    //     check: check,
    //     append: append,
    //     close: close,
    //     unlink: unlink
    // };
// });


// fileCheck("test", "test10",)
//     .then(path => fileAppend(path as string, "New Data"))
//     .catch(error => console.log(error));

//fileUpdate("test", "test10", "Hello World1").then(result => console.log(result));


