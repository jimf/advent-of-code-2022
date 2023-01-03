export default class Emitter {
    constructor() {
        this.listeners = {};
    }

    on(eventName, callback) {
        this.listeners[eventName] ??= [];
        this.listeners[eventName].push(callback);
        return this;
    }

    off(eventName, callback) {
        if (this.listeners[eventName]) {
            if (callback) {
                this.listeners[eventName] = this.listeners.eventName.filter(other => other !== callback);
            } else {
                delete this.listeners[eventName];
            }
        }

        return this;
    }

    once(eventName, callback) {
        const wrappedCallback = (...args) => {
            this.off(eventName, wrappedCallback);
            callback(...args);
        };
        this.on(eventName, wrappedCallback);
        return this;
    }

    trigger(eventName, ...args) {
        if (this.listeners[eventName]) {
            this.listeners[eventName].forEach(callback => {
                callback(...args);
            });
        }

        return this;
    }
}
