const TransactionController = require('./controllers/transaction-controller')
const schedule = require('node-schedule');
const getSize = require('get-folder-size');

let main = () => {
  const controller = new TransactionController();

  controller.register('#tr_1_1', 5);
  controller.register('#tr_1_2', 5);
  controller.register('#tr_1_3', 5);
  // after 10 min
  controller.register('#tr_2_1', 10);
  controller.register('#tr_2_2', 10);
  controller.register('#tr_2_3', 10);

  controller.register('#tr_3_1', 15);
  controller.register('#tr_3_2', 15);
  controller.register('#tr_3_3', 15);

  controller.register('#tr_4_1', 20);
  controller.register('#tr_4_2', 20);
  controller.register('#tr_4_3', 20);

  controller.register('#tr_5_1', 25);
  controller.register('#tr_5_2', 25);
  controller.register('#tr_5_3', 25);

  controller.register('#tr_6_1', 30);
  controller.register('#tr_6_2', 30);
  controller.register('#tr_6_3', 30);

  controller.register('#tr_7_1', 35);
  controller.register('#tr_7_2', 35);
  controller.register('#tr_7_3', 35);

  controller.register('#tr_8_1', 40);
  controller.register('#tr_8_2', 40);
  controller.register('#tr_8_3', 40);
  //controller.register('#tr_3', 15, 50000);
  // controller.otherRun();


  console.log('start: ', new Date().toISOString());
  var j = schedule.scheduleJob('0 * * * *', function() {
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