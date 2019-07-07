# ba-eth-sa

## Install Ethereum and Swarm

### Install Go
Download precompiled Go binaries from [official project site](https://golang.org/dl)

For x86_64 Linux
```
$ sudo apt install -y curl
$ sudo apt install -y build-essential
$ sudo apt install -y screen
$ curl -O https://storage.googleapis.com/golang/go1.9.linux-amd64.tar.gz
```
For Raspberry Pi Linux
```
$ sudo apt install -y curl
$ sudo apt install -y build-essential
$ sudo apt install -y screen
$ curl -O https://storage.googleapis.com/golang/go1.9.linux-armv6l.tar.gz
```
Install Go binaries
```
$ sudo tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
```
Add path to /etc/profile (for a system-wide installation) or $HOME/.profile
echo 'export GOROOT=/usr/local/go' >> ~/.bashrc
echo 'export GOPATH=$HOME/go' >> ~/.bashrc
echo 'export PATH=$PATH:$GOROOT/bin:$GOPATH/bin' >> ~/.bashrc
```

### Build Ethereum and Swarm Client
```
$ git clone https://github.com/ethereum/go-ethereum.git
$ cd go-ethereum
$ git checkout v1.6.7
$ make geth
$ make swarm
$ sudo cp build/bin/geth /usr/local/bin/geth
$ sudo cp build/bin/swarm /usr/local/bin/swarm
```


### Genesis.json example
```
{
    "config": {
        "chainId": 42,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
    "nonce": "0x0000000000000042",
    "timestamp": "0x0",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "gasLimit": "0x8001000",
    "difficulty": "0x1",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "coinbase": "0x3333333333333333333333333333333333333333",
    "alloc": {
        "ACCOUNT_ID_1": {
            "balance": "200000000000000000000000000"
        },
        "ACCOUNT_ID_2": {
            "balance": "200000000000000000000000000"
        },
        "ACCOUNT_ID_3": {
            "balance": "200000000000000000000000000"
        }
    }
}
```
## Private Ethereum Network

### Setup Node Zero
Create a new account for private net
```javascript
$ geth --datadir "~/node" account new
```
Create a private chain with the custom genesis block
```javascript
$ geth --datadir "~/node" init genesis.json
```
Launch node zero, a mining full node in cloud
```javascript
$ geth --rpc --rpcport "8001" --rpccorsdomain "*" --datadir "~/node" --port "30303" --rpcapi "db,eth,net,web3,personal" --identity "zero" --networkid 666 --mine --minerthreads 1 console
```
To run in background with ```screen``` (CTRL+A then D for detaching), check ```geth.sh``` script
```javascript
$ screen -dmS geth /usr/local/bin/geth --rpc --rpcport "8001" --rpccorsdomain "*" --datadir "~/node" --port "30303" --rpcapi "db,eth,net,web3,personal" --identity "zero" --networkid 666 --mine --minerthreads 8
$ screen -x geth
```
For attaching geth console
```javascript
$ geth --datadir "/root/node" attach ipc:/root/node/geth.ipc console
```

Run ```eth.getBalance(eth.coinbase)``` command to check the (pre-allocated) account balance  
Run ```admin.nodeInfo``` to get enode url (```enode://xxxxx```) and add ip address of the interface ```[::]``` to construct the complete enode address to share with other peers
```javascript
"enode://6ad5934db83a0266c4c6d5048d02f86b3e69251d45ad411387cde9cc5a86030f2bee4bcbe200d4238d91b01c94444e562986058c9c4acca2a92cb81eb012acfc@192.168.2.41:30303?discport=0"
```

### Setup Node One

Setup and launch node one: a non-mining full node
```javascript
$ geth --datadir "~/node" account new
$ geth --datadir "~/node" init genesis.json
$ geth --rpc --rpcport "8001" --rpccorsdomain "*" --datadir "~/node" --port "30303" --nodiscover --rpcapi "db,eth,net,web3,personal" --identity "one" --networkid 666 console
```

Run ```admin.addPeer``` to connect node zero
```javascript
> admin.addPeer("enode://6ad5934db83a0266c4c6d5048d02f86b3e69251d45ad411387cde9cc5a86030f2bee4bcbe200d4238d91b01c94444e562986058c9c4acca2a92cb81eb012acfc@192.168.2.41:30303")
```
Or create a ```<datadir>/static-nodes.json``` file that has the following format
```javascript
[
  "enode://f4642fa65af50cfdea8fa7414a5def7bb7991478b768e296f5e4a54e8b995de102e0ceae2e826f293c481b5325f89be6d207b003382e18a8ecba66fbaf6416c0@33.4.2.1:30303",
  "enode://pubkey@ip:port"
]
````

Send ether from node zero to one using one's wallet address (do not forget to mine if you are the only node mining)
```javascript
> personal.unlockAccount(eth.coinbase)
> eth.sendTransaction({from:eth.coinbase, to: '0xcb2a95f964acf8adee7fae30cf5dc6a3f5e14a5c', value: web3.toWei(.000000000001, "ether")})
> miner.start()
> miner.stop()
```

### Setup Node Two

Setup and launch node two: a non-mining light node
```javascript
$ geth --datadir "~/node" account new
$ geth --datadir "~/node" init genesis.json
$ geth --rpc --rpcport "8001" --rpccorsdomain "*" --datadir "~/node" --port "30303" --rpcapi "db,eth,net,web3,personal" --identity "two" --networkid 666 --light console
