import { EE, IDispatch, EVENTS } from './EventEmitter'


export const dispatch = <T, _>(action: IDispatch<T>) => { EE.emit(EVENTS.DISPATCH, action) }
