class EventEmitter {

  private _events: { [K: string]: Function[] } = {}

  on(event: string, listener: (...args: any[]) => any) { // add event listeners
    if (!this._events[event]) { this._events[event] = [] }

    this._events[event].push(listener);

    return () => this.off(event, listener)
  }

  off(event: string, listener: Function) { // remove listeners
    const index = this._events[event].findIndex(l => l === listener)

    if (!(index > -1)) throw new Error('Listener not found')

    this._events[event].splice(index, 1);
  }

  emit(event: string, ...payload: unknown[]) { // trigger events
    for (const listener of this._events[event]) {
      listener.apply(this, payload)
    }
  }
}

export const EE = new EventEmitter();
