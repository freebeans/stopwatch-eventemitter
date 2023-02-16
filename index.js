module.exports = StopwatchEventEmitter;

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
        this.eventEmitter.emit(this.event, {timeDiff: this.diff, data: this.data})
    }

    _timeoutExpired_InternalCallback() {
        this.eventEmitter.emit(this.event, {timeoutExpired: true, data: this.data})
    }
}