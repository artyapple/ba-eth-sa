const fs = require("fs");
const LogItem = require('./log-item')

let globalNumber = 0;

let log = (logItem) => {
    fs.appendFileSync('result.txt', logItem.formatedItem);
}

let doTransaction = async (trGroupNumber, trNumber) => {
    return new Promise((resolve, reject) => {
        const item = new LogItem({
            startTime: new Date(),
            txNumber: globalNumber,
            setNumber: trGroupNumber,
            txSetNumber: trNumber
        });
        setTimeout(() => {
            console.info(`${++globalNumber}  ${trGroupNumber} ${trNumber} -> do Transaction`);
            item.endTime = new Date();
            log(item);
            resolve();
        }, 2000);
    })
};

let callDoTransaction = async (trGroupNumber, callCnt) => {
    await doTransaction(trGroupNumber, callCnt);
    
    if(callCnt == 1) {
        return;
    }

    callDoTransaction(trGroupNumber, --callCnt);

}

let control = async (trGroupNumber, callCnt, ms)=> {
    setTimeout(async () => {
        await callDoTransaction(trGroupNumber, callCnt);
    }, ms);
}

let main = async ()=> {
    await control('#tr_1', 1, 0);
    await control('#tr_2', 5, 11000);
    await control('#tr_3', 15, 50000);
}

main();