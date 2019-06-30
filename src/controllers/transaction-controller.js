const Logger = require('../logger');
const LogItem = require('../models/log-item');
const EthereumService = require('../services/ethereum-service');
const TransactionSetItem = require('../models/transaction-set-item');
const TransactionSetCollection = require('../models/transaction-set-collection')

module.exports = class TransactionController {

  constructor() {
    this.logger = new Logger();
    this.globalNumber = 0;
    this.collection = new TransactionSetCollection();
  }

  register(setNumber, callCnt, ms) {
    const item = new TransactionSetItem(setNumber, callCnt, ms);
    this.collection.add(item);
  }

  run() {
    if (this.collection.completed) {
      return;
    }

    const item = this.collection.next();
    this.runItem(item)
      .then(() => {
        this.run();
      }).catch((err) => {

      });
  }

  runItem(item) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.callDoTransaction(item.setNumber, item.callCnt)
          .then((data) => {
            resolve(data);
          }).catch((err) => {
            reject(err);
          });
      }, item.ms);
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

  doTransaction(setNumber, trNumber) {
    return new Promise((resolve, reject) => {
      const item = new LogItem({
        startTime: new Date(),
        txNumber: ++this.globalNumber,
        setNumber: setNumber,
        txSetNumber: trNumber
      });

      const txNumber = item.txNumber;
      console.log(`> do transaction nr. ${txNumber}`);
      const service = new EthereumService();
      service.transact()
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