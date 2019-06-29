const Web3 = require('web3');

module.exports = class EtheriumService {

    transact() {
        return new Promise((resolve, reject) => {
            let web3;
            if (typeof web3 !== 'undefined') {
                web3 = new Web3(web3.currentProvider);
            } else {
                // set the provider you want from Web3.providers
                web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8001"));
            }

            // web3.eth.defaultAccount = web3.eth.accounts[0];
            web3.eth.defaultAccount = '0x62a86f3cae24e6bdcf10bd616cfdb7049c04f745';
            console.log('web3.eth.defaultAccount', web3.eth.defaultAccount);

            //web3.eth.personal.unlockAccount(web3.eth.defaultAccount, "haw", 15000);

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

            CoursetroContract.methods.set_device_data(web3.eth.defaultAccount, 'other-some-test-hash').send({ from: web3.eth.defaultAccount })
                .then((data) => {
                    console.log('set_device_data', data);
                    CoursetroContract.methods.get_device_timestamps(web3.eth.defaultAccount).call()
                        .then((data) => {
                            console.log('get_device_timestamps', `Length ${data.length}`, `Last BigNumber ${data[data.length -1]}`);
                            resolve(data);
                        }).catch((err) => {
                            console.error(err)
                            reject(err);
                        });
                }).catch((err) => {
                    console.error(err)
                    reject(err);
                });
        });
    }
}
