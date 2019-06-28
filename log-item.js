module.exports = class LogItem {
    constructor(obj) {
        this.startTime  = obj.startTime;
        this.endTime    = obj.endTime;
        this.txNumber   = obj.txNumber;
        this.setNumber  = obj.setNumber;
        this.txSetNumber= obj.txSetNumber;
    }

    get duration() {
        return this.endTime - this.startTime;
    }

    get formatedItem() {
        return `${this.txNumber}  ${this.setNumber} ${this.txSetNumber}: ${this.startTime.toISOString()} - ${this.endTime.toISOString()} ${this.duration} \n`
    }
}
