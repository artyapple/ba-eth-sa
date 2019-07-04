const Web3 = require('web3');
const Accounts = require('web3-eth-accounts');
const axios = require('axios');


module.exports = class EthereumService {

  constructor(ethAddr, ethAcc, pw, contractAddr, swarmAddr) {
    this.ethAddr = ethAddr;
    this.ethAcc = ethAcc;
    this.pw = pw;
    this.contractAddr = contractAddr;
    this.swarmAddr = swarmAddr;
  }

  // setDataEth(contract, acc, data) {
  //   contract.methods.set_device_data(acc, data).send({
  //     from: acc,
  //     gas: 700000
  //   });
  // }

  transact(protocol) {
    return new Promise((resolve, reject) => {
      let web3;
      if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
      } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider(this.ethAddr));
      }

      web3.eth.defaultAccount = this.ethAcc;
      console.log('web3.eth.defaultAccount', web3.eth.defaultAccount);

      web3.eth.personal.unlockAccount(web3.eth.defaultAccount, this.pw, 15000).then((data) => {
        console.log(data)
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
        }], this.contractAddr);
        // set iot data in swarm

        let iotData = '{ "payload":' + new Date().getTime() + '}';
        console.log('IoT data: ', iotData);


        let setDataEthStart = new Date();
        // set iot-data-hash in ethereum
        CoursetroContract.methods.set_device_data(web3.eth.defaultAccount, iotData).send({
          from: web3.eth.defaultAccount,
          gas: 700000
        }).then((data) => {
          protocol.setEthDuration = (new Date() - setDataEthStart);
          console.log('set_device_data', `Status ${data.status}`, `Transaction Hash ${data.transactionHash}`);
          let getTsEthStart = new Date();
          // get data timestamps from ethereum for current device
          CoursetroContract.methods.get_device_timestamps(web3.eth.defaultAccount).call()
            .then((timestamps) => {
              protocol.getTsEthDuration = new Date() - getTsEthStart;
              console.log('get_device_timestamps', `Length ${timestamps.length}`, `Last BigNumber ${timestamps[timestamps.length -1]}`);
              // get iot-data-hash by timestamp for current device
              CoursetroContract.methods.get_device_data(web3.eth.defaultAccount, timestamps[timestamps.length - 1]).call().then((ghash) => {
                console.log('Value from blockchain: ', ghash);
                let dataurl = this.swarmAddr + ghash;
                resolve(ghash);
                // get iot data from swarm by hash value

              }).catch((err) => {
                console.error(err)
                reject(err);
              });
            }).catch((err) => {
              console.error(err)
              reject(err);
            });
        }).catch((err) => {
          console.error(err)
          reject(err);
        });
      }).catch((err) => {
        console.log(err)
        reject(err);
      });
    });
  }


}