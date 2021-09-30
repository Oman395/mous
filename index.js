import fs from "fs";
import readline from 'readline';
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
    rl.question("What are the different labels of data? Please seperate each one with a space.", (answer) => {
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

function saveData(dta, extfolder) {
    Object.keys(dta).forEach((item) => {
        if (!fs.existsSync(`Output(${file})`)) fs.mkdirSync(`Output(${file})`);
        if (!fs.existsSync(`Output(${file})/${extfolder}/`)) fs.mkdirSync(`Output(${file})/${extfolder}/`)
        if (!fs.existsSync(`Output(${file})/${extfolder}/${item.replace('\r', '')}`)) fs.mkdirSync(`Output(${file})/${extfolder}/${item.replace('\r', '')}`);
        Object.keys(dta[item]).forEach((thing) => {
            var str = "";
            Object.keys(dta[item][thing]).forEach((that) => {
                str += `${that}: ${dta[item][thing][that]}\n`;
            })
            fs.writeFileSync(`Output(${file})/${extfolder}/${item.replace('\r', '')}/${thing.replace('\r', '')}.txt`, str);
        });
    })
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

function loop() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('What would you like to sort by? Send "e" to exit. ', (answer) => {
        if (answer != 'e' && answer != 'E') {
            var response = {};
            Object.keys(parsed).forEach((parse) => {
                if (parsed[parse]) {
                    if (!response[parsed[parse][answer]]) response[parsed[parse][answer]] = {};
                    response[parsed[parse][answer]][parse] = {};
                    Object.keys(parsed[parse]).forEach((item) => {
                        if (answer != item) {
                            response[parsed[parse][answer]][parse][item] = parsed[parse][item];
                        }
                    })
                }
            });
            saveData(response, answer);
            rl.close();
            loop();
        } else {
            rl.close();
        }
    });
}