class StopwatchEventEmitter {
    constructor({event, eventEmitter, timeout}, data) {
        this.event = event;
        this.eventEmitter = eventEmitter;
        this.timeoutMs = timeout;
        this.data = data;
        
        // Calling this.stop() will trigger an internal Promise fullfillment
        this.stopPromise = new Promise( resolve => {
            this.stop = resolve.bind(this, this._stop_InternalCallback)
        })
    }

    start() {
        this.startTime = new Date();
        
        // Creates and starts a timeout Promise
        const timeoutPromise = new Promise( resolve => setTimeout( () => resolve(this._timeoutExpired_InternalCallback), this.timeoutMs))
        
        // Races the timeout and stop Promises. Whichever fullfills first will have its argument called.
        Promise.any([timeoutPromise, this.stopPromise]).then(fn => fn.apply(this))
        
        return this;
    }

    _stop_InternalCallback() {
        this.stopTime = new Date()
        this.diff = this.stopTime - this.startTime
        
        this.eventEmitter.emit(this.event, {timeDiff: this.diff, data: this.data})
    }

    _timeoutExpired_InternalCallback() {
        this.eventEmitter.emit(this.event, {timeoutExpired: true, data: this.data})
    }
}

module.exports = StopwatchEventEmitter;