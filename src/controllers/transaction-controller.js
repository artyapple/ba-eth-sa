const Logger = require('../logger');
const LogItem = require('../models/log-item');
const EthereumService = require('../services/ethereum-service');
const TransactionSetItem = require('../models/transaction-set-item');
const TransactionSetCollection = require('../models/transaction-set-collection')
const config = require('config');
const schedule = require('node-schedule');
const getSize = require('get-folder-size');

module.exports = class TransactionController {

  constructor() {
    this.logger = new Logger();
    this.globalNumber = 0;
    this.collection = new TransactionSetCollection();
    this.service = new EthereumService(config.get('ethAddr'), config.get('ethAccount'), config.get('password'), config.get('contractAddr'), config.get('swarmAddr'));
  }

  register(setNumber, callCnt) {
    const item = new TransactionSetItem(setNumber, callCnt, ms);
    this.collection.add(item);
  }

  otherRun() {
    let items = this.collection;
    console.log('start: ', new Date().toISOString());
    var j = schedule.scheduleJob('*/10 * * * *', function() {
      if (items.completed) {
        console.log('finish', new Date().toISOString());
        return;
      } else {
        let item = items.next();
        callDoTransaction(item.setNumber, item.callCnt);
      }
    });
  }

  callDoTransaction(setNumber, callCnt) {
    return new Promise((resolve, reject) => {
      if (callCnt == 0) {
        return resolve();
      }

      this.doTransaction(setNumber, callCnt)
        .then(() => {
          this.callDoTransaction(setNumber, --callCnt)
            .then((data) => {
              resolve(data);
            }).catch((err) => {
              reject(err);
            });
        }).catch((err) => {
          reject(err);
        });
    })
  }

  doTransaction(setNumber, txSetNumber) {
    return new Promise((resolve, reject) => {
      const item = new LogItem({
        txNumber: ++this.globalNumber,
        setNumber: setNumber,
        txSetNumber: txSetNumber,
        deviceId: config.get('deviceId')
      });
      getSize(config.get('gethFolder'), (err, size) => {
        if (err) {
          throw err;
        }
        item.gethFolderSize = size;
      });
      getSize(config.get('swarmFolder'), (err, size) => {
        if (err) {
          throw err;
        }
        item.swmFolderSize = size;
      });

      console.log('txSetNumber', txSetNumber, 'setNumber', setNumber);
      const txNumber = item.txNumber;
      console.log(`> do transaction nr. ${txNumber}`);
      item.startTime = new Date();
      this.service.transact(item)
        .then((data) => {
          console.log(`> end of transaction nr. ${txNumber}`);
          item.endTime = new Date();
          this.logger.info(item);
          resolve(data);
        }).catch((err) => {
          reject(err);
        });
    })
  };
}