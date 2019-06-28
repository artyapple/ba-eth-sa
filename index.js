const fs = require("fs");
const Web3 = require('web3');
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

        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8001"));
        }
        web3.eth.defaultAccount = web3.eth.accounts[0];

        web3.eth.personal.unlockAccount(web3.eth.defaultAccount, "haw", 15000);

        var CoursetroContract = web3.eth.Contract([{
            constant: true,
            inputs: [],
            name: "get_device_count",
            outputs: [{
                name: "count",
                type: "uint256"
            }],
            payable: false,
            stateMutability: "view",
            type: "function"
        }, {
            constant: false,
            inputs: [],
            name: "kill",
            outputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
        }, {
            constant: true,
            inputs: [{
                name: "device_id",
                type: "address"
            }],
            name: "get_device_timestamps",
            outputs: [{
                name: "timestamp",
                type: "uint256[]"
            }],
            payable: false,
            stateMutability: "view",
            type: "function"
        }, {
            constant: false,
            inputs: [{
                name: "device_id",
                type: "address"
            }, {
                name: "filehash",
                type: "string"
            }],
            name: "set_device_data",
            outputs: [{
                name: "index",
                type: "uint256"
            }, {
                name: "timestamp",
                type: "uint256"
            }],
            payable: false,
            stateMutability: "nonpayable",
            type: "function"
        }, {
            constant: true,
            inputs: [{
                name: "device_id",
                type: "address"
            }],
            name: "is_device_present",
            outputs: [{
                name: "result",
                type: "bool"
            }],
            payable: false,
            stateMutability: "view",
            type: "function"
        }, {
            constant: true,
            inputs: [{
                name: "device_id",
                type: "address"
            }, {
                name: "timestamp",
                type: "uint256"
            }],
            name: "get_device_data",
            outputs: [{
                name: "hash",
                type: "string"
            }],
            payable: false,
            stateMutability: "view",
            type: "function"
        }, {
            constant: true,
            inputs: [{
                name: "index",
                type: "uint256"
            }],
            name: "get_device_at_index",
            outputs: [{
                name: "device_address",
                type: "address"
            }],
            payable: false,
            stateMutability: "view",
            type: "function"
        }, {
            inputs: [],
            payable: false,
            stateMutability: "nonpayable",
            type: "constructor"
        }, {
            anonymous: false,
            inputs: [{
                indexed: true,
                name: "device_id",
                type: "address"
            }, {
                indexed: false,
                name: "index",
                type: "uint256"
            }, {
                indexed: false,
                name: "timestamp",
                type: "uint256"
            }, {
                indexed: false,
                name: "filehash",
                type: "string"
            }],
            name: "log_action",
            type: "event"
        }], '0x6bb79673638386196357b1b9032219aba6bf3c10'
        );
        CoursetroContract.methods.set_device_data(web3.eth.defaultAccount, 'other-some-test-hash').send({ from: web3.eth.defaultAccount }).then((data) => {
            console.log(data);
            CoursetroContract.methods.get_device_timestamps(web3.eth.defaultAccount).call().then((data) => {
                console.log(data);
                item.endTime = new Date();
                log(item);
                resolve();
            });
        });

        // setTimeout(() => {
        //     console.info(`${++globalNumber}  ${trGroupNumber} ${trNumber} -> do Transaction`);
        //     item.endTime = new Date();
        //     log(item);
        //     resolve();
        // }, 2000);
    })
};

let callDoTransaction = async (trGroupNumber, callCnt) => {
    await doTransaction(trGroupNumber, callCnt);

    if (callCnt == 1) {
        return;
    }

    callDoTransaction(trGroupNumber, --callCnt);

}

let control = async (trGroupNumber, callCnt, ms) => {
    setTimeout(async () => {
        await callDoTransaction(trGroupNumber, callCnt);
    }, ms);
}

let main = async () => {
    await control('#tr_1', 1, 0);
    await control('#tr_2', 5, 11000);
    await control('#tr_3', 15, 50000);
}

main();