const fs = require("fs");

module.exports = class Logger {
  info(logItem) {
    fs.appendFileSync('result-' + logItem.deviceId + '.txt', logItem.formatedItem);
  }
}