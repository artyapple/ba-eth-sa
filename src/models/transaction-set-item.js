module.exports = class TransactionSetItem {
    constructor(setNumber, callCnt, ms) {
        this.setNumber = setNumber;
        this.callCnt = callCnt;
        this.ms = ms;
    }
}