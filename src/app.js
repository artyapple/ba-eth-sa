const TransactionController = require('./controllers/transaction-controller')

let main =  () => {
    const controller = new TransactionController();
    controller.register('#tr_1', 1, 0);
    controller.register('#tr_2', 5, 11000);
    //controller.register('#tr_3', 15, 50000);
    controller.run();
}

main();
