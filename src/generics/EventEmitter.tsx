export enum EVENTS {
  BATCH_DISPATCH,
  DISPATCH,
  STORE_CHANGE,
}

export interface IDispatch<T> {
  payload: Partial<T>;
  type: keyof T | EVENTS;
}

// tslint:disable-next-line: no-any
type Func = (...args: any[]) => void
interface IEvent { [K: string]: Func[] }

export class EventEmitter {

  private readonly _events: IEvent = {}

  public emit(event: keyof IEvent, ...payload: unknown[]) { // trigger events
    if (!(event in this._events)) return

    for (const listener of this._events[event]) {
      listener.apply(this, payload)
    }
  }

  public off(event: keyof IEvent, listener: Func) { // remove listeners
    if (!(event in this._events)) return

    const index = this._events[event].findIndex((l) => Object.is(l, listener))

    if (!(index > -1)) throw new Error('Listener not found')

    this._events[event].splice(index, 1);
  }

  public on(event: keyof IEvent, listener: Func) { // add event listeners
    if ((typeof this._events[event]) === 'undefined')
      this._events[event] = []

    this._events[event].push(listener);

    return () => { this.off(event, listener) }
  }
}


export const EE = new EventEmitter();
