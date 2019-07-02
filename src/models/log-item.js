module.exports = class LogItem {
  constructor(obj) {
    // global tx number
    this.txNumber = obj.txNumber;
    // number of set
    this.setNumber = obj.txSetNumber;
    // transaction in set
    this.txSetNumber = obj.txSetNumber;
    // decice identifier
    this.deviceId = obj.deviceId;
    // start time of tx
    this.startTime = obj.startTime;
    // end time of tx
    this.endTime = obj.endTime;
    // data in / out equals
    this.dataEql = false;

    // eth and swarm tx duration
    //
    // set_swarm
    this.setSwmDuration = obj.setSwmDuration;
    // set_data_eth duration
    this.setEthDuration = obj.setEthDuration;
    // set_ts_eth duration
    this.getTsEthDuration = obj.getTsEthDuration;
  }

  get duration() {
    return this.endTime - this.startTime;
  }

  get formatedItem() {
    return `${this.txNumber};${this.setNumber};${this.txSetNumber};${this.deviceId};${this.startTime.toISOString()};${this.endTime.toISOString()};${this.duration};${this.dataEql};${this.setSwmDuration};${this.setEthDuration};${this.getTsEthDuration};\n`
  }
}