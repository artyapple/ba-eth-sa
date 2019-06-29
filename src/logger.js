const fs = require("fs");

module.exports = class Logger {
    info(logItem) {
        fs.appendFileSync('result.txt', logItem.formatedItem);
    }
}