const fs = require("fs");
const readline = require("readline");
var data;
var file;
var options;
var parsed;
var key;

function getFile(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('What file would you like to sort? ', (answer) => {
        if (fs.existsSync(answer)) {
            rl.close();
            file = answer;
            callback(fs.readFileSync(answer, 'utf-8'));
        } else {
            console.error("I'm sorry, but that file does not exist. Please try again.");
            rl.close();
            callback(null);
        }
    });
}

function getSorting(callback) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("What are the different labels of data? Please seperate each one with a space. ", (answer) => {
        const args = answer.split(" ");
        rl.close();
        callback(args);
    });
}

function sort(dta, opts, callback) {
    var localParsed = {};
    var step = false;
    dta = dta.split("\n");
    dta.forEach((item, index) => {
        if (!step) {
            localParsed[item] = {};
            step = item;
        } else {
            var split = item.split(" ");
            opts.forEach((option, index) => {
                localParsed[step][option] = split[index];
            });
            step = false;
        }
        if (index == dta.length - 1) {
            callback(localParsed);
        }
    });
}
function start() {
    getFile((dta) => {
        data = dta;
        getSorting((dta1) => {
            options = dta1;
            sort(data, options, (dta2) => {
                parsed = (dta2);
                loop();
            });
        });
    });
}
start();
function sorttoo(args) {
    var returnedData = {};
    if (args.length > 1) {
        args.forEach((arg, index) => {
            if (index == 0) {
                Object.keys(parsed).forEach((label) => {
                    if (!returnedData[parsed[label][arg]]) returnedData[parsed[label][arg]] = {};
                })
            } else {
                Object.keys(returnedData).forEach((loc) => {
                    Object.keys(parsed).forEach((label) => {
                        if (parsed[label][args[0]] == loc) {
                            if (!returnedData[loc][parsed[label][arg]]) returnedData[loc][parsed[label][arg]] = {};
                            returnedData[loc][parsed[label][arg]][label] = {};
                            Object.keys(parsed[label]).forEach((entry) => {
                                if (!args.includes(entry)) {
                                    returnedData[loc][parsed[label][arg]][label][entry] = parsed[label][entry];
                                }
                            });
                        }
                    });
                });
            }
        })
    } else {
        args.forEach((arg, index) => {
            Object.keys(parsed).forEach((label) => {
                if (!returnedData[parsed[label][arg]]) returnedData[parsed[label][arg]] = {};
                returnedData[parsed[label][arg]][label] = {};
                Object.keys(parsed[label]).forEach((entry) => {
                    if (!args.includes(entry)) {
                        returnedData[parsed[label][arg]][label][entry] = parsed[label][entry];
                    }
                });
            });
        });
    }
    return (returnedData);
}
function write(returnedData, args) {
    if (args.length > 1) {
        Object.keys(returnedData).forEach((one) => {
            if (!fs.existsSync(`Output(${file}, ${args[0]}-${args[1]})`)) fs.mkdirSync(`Output(${file}, ${args[0]}-${args[1]})`);
            if (!fs.existsSync(`Output(${file}, ${args[0]}-${args[1]})/${one.replace("\r", '')}`)) fs.mkdirSync(`Output(${file}, ${args[0]}-${args[1]})/${one.replace("\r", '')}`);
            var path = `Output(${file}, ${args[0]}-${args[1]})/${one.replace("\r", '')}`;
            Object.keys(returnedData[one]).forEach((two) => {
                if (!fs.existsSync(`${path}/${two.replace("\r", '')}`)) fs.mkdirSync(`${path}/${two.replace("\r", '')}`);
                Object.keys(returnedData[one][two]).forEach((item) => {
                    var str = "";
                    Object.keys(returnedData[one][two][item]).forEach((entry) => {
                        str += `${entry}: ${returnedData[one][two][item][entry]}\n`;
                    })
                    fs.writeFileSync(`${path}/${two.replace("\r", '')}/${item.replace('\r', '')}.txt`, str);
                })
            })
        })
    } else {
        if (!fs.existsSync(`Output(${file}, ${args[0]})`)) fs.mkdirSync(`Output(${file}, ${args[0]}})`);
        var path = `Output(${file}, ${args[0]}})`;
        Object.keys(returnedData).forEach((one) => {
            if (!fs.existsSync(`${path}/${one.replace("\r", '')}`)) fs.mkdirSync(`${path}/${one.replace("\r", '')}`);
            Object.keys(returnedData[one]).forEach((item) => {
                var str = "";
                Object.keys(returnedData[one][item]).forEach((entry) => {
                    str += `${entry}: ${returnedData[one][item][entry]}\n`;
                })
                fs.writeFileSync(`${path}/${one.replace("\r", '')}/${item.replace('\r', '')}.txt`, str);
            })
        })
    }
}
function loop() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('What would you like to sort by? Send "e" to exit. ', (answer) => {
        if (answer != "E" && answer != "e") {
            var args = answer.split(" ");
            var returnedData = sorttoo(args);
            write(returnedData, args);
            rl.close();
            loop();
        } else {
            rl.close();
        }
    });
}