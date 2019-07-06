const TransactionController = require('./controllers/transaction-controller')
const schedule = require('node-schedule');
const getSize = require('get-folder-size');

let main = () => {
  const controller = new TransactionController();
  controller.register('#tr_1', 3);
  // after 10 min
  controller.register('#tr_2', 4);
  // after 20 min
  controller.register('#tr_3', 5);

  controller.register('#tr_4', 6);

  controller.register('#tr_5', 7);

  controller.register('#tr_6', 8);

  //controller.register('#tr_3', 15, 50000);
  // controller.otherRun();


  console.log('start: ', new Date().toISOString());
  var j = schedule.scheduleJob('*/10 * * * *', function() {
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