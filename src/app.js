const TransactionController = require('./controllers/transaction-controller')

let main = () => {
  const controller = new TransactionController();
  controller.register('#tr_1', 5, 0);
  // after 10 min
  controller.register('#tr_2', 10, 600000);
  // after 20 min
  controller.register('#tr_3', 20, 1200000);
  //controller.register('#tr_3', 15, 50000);
  controller.run();
}

main();