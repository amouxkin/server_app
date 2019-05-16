import * as fs from 'fs';
import * as path from 'path';

// export default (function () {
    const baseDir = path.join(__dirname, '/../data/');

    export function create(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
                fs.open(baseDir + path + "/" + fileName + "." + type, "wx", function (error, fileDescriptor) {
                    return error ? reject(error) : resolve(fileDescriptor);
                });
            }
        );
    }

    export function write(fileDescriptor: number, stringData: string) {
        return new Promise(function (resolve, reject) {
                fs.writeFile(fileDescriptor, stringData, function (error) {
                    error ? reject(error) : resolve(fileDescriptor);
                });
            }
        );
    }

    export function close(fileDescriptor: number) {
        return new Promise(function (resolve, reject) {
            fs.close(fileDescriptor, function (error) {
                error ? reject(error) : resolve();
            });
        });
    }

    export function read(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.readFile(baseDir + path + "/" + fileName + "." + type, 'utf8', function (error, data) {
                error ? reject(error) : resolve(data);
            })
        });
    }

    export function open(path: string, fileName: string, type: string = "json",) {
        return new Promise(function (resolve, reject) {
            fs.open(baseDir + path + "/" + fileName + "." + type, "r+", function (error, fileDescriptor) {
                return error ? reject(error) : resolve(fileDescriptor);
            });
        });
    }

    export function update(path: string, fileName: string, dataString: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.appendFile(baseDir + path + "/" + fileName + "." + type, dataString, {flag: "w+"}, function (error) {
                error ? reject(error) : resolve();
            })
        });
    }

    export function check(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.stat(baseDir + path + "/" + fileName + "." + type, function (error, stats) {
                error ? reject(error) : resolve(baseDir + path + "/" + fileName + "." + type);
            })
        });
    }

    export function append(path: string, dataString: string) {
        return new Promise(function (resolve, reject) {
            fs.appendFile(path, dataString, function (error) {
                error ? reject(error) : resolve();
            });
        });
    }

    export function unlink(path: string, fileName: string, type: string = "json") {
        return new Promise(function (resolve, reject) {
            fs.unlink(baseDir + path + "/" + fileName + "." + type, function (error) {
                error ? reject(error) : resolve();
            });
        });
    }
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


