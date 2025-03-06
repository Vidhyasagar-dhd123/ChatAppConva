// A queue that stores the messages of current session
class Inbox {
    constructor() {
        this.messages = [];
    }
    enqueue(element) {
        this.messages.push(element);
    }
    dequeue() {
        if (this.isEmpty()) {
            throw new Error("Queue is empty");
        }
        return this.messages.shift();
    }
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.messages[0];
    }
    isEmpty() {
        return this.messages.length === 0;
    }
    size() {
        return this.messages.length;
    }
}

module.exports = Inbox