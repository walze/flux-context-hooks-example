import { EE, IDispatch } from './EventEmitter'


export const dispatch = <T, _>(action: IDispatch<T>) => { EE.emit('dispatch', action) }
