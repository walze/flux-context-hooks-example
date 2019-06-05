class EventEmitter {
    constructor() {
        /**
         * @type { { [K: string]: Function[] } }
         */
        this._events = {}
    }

    /**
     * @param { string } event 
     * @param { Function } listener 
     */
    on(event, listener) { // add event listeners
        if (!this._events[event])
            this._events[event] = []

        this._events[event].push(listener);

        return () => this.off(event, listener)
    }

    off(event, listener) { // remove listeners
        const index = this._events[event].findIndex(l => l === listener)

        if (!(index > -1)) throw new Error(`Listener not found`)

        this._events[event].splice(index, 1);
    }

    emit(event, ...payload) { // trigger events
        for (const listener of this._events[event]) {
            listener.apply(this, payload)
        }
    }
}

export const EE = new EventEmitter();