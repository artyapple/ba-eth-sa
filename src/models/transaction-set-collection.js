module.exports = class TransactionSetCollection {
    
    constructor() {
        this.clear();
    }

    get count() {
        return this.sets.length;
    }

    get completed() {
        return this.currentIndex > this.count;
    }

    any() {
        return this.sets.length > 0;
    }

    reset() {
        this.currentIndex = 0;
    }

    clear() {
        this.sets = [];
        this.reset();
    }

    add(item) {
        this.sets.push(item);
    }

    remove(item) {
        const index = this.sets.indexOf(item);
        this.sets.splice(index, 1);
    }

    next() {
        return this.sets[this.currentIndex++];
    }
}