const TransactionController = require('./controllers/transaction-controller')
const schedule = require('node-schedule');
const getSize = require('get-folder-size');

let main = () => {
  const controller = new TransactionController();
  controller.register('#tr_1', 3, 0);
  // after 10 min
  controller.register('#tr_2', 4, 600000);
  // after 20 min
  controller.register('#tr_3', 5, 1200000);

  console.log('start: ', new Date().toISOString());
  var j = schedule.scheduleJob('*/2 * * * *', function() {
    if (controller.collection.completed) {
      console.log('finish', new Date().toISOString());
      return;
    } else {
      let item = controller.collection.next();
      controller.callDoTransaction(item.setNumber, item.callCnt);
    }
  });
}

main();
