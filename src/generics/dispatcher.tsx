import { EE } from './EventEmitter'


export const dispatch = (action: { type: string, payload: unknown }) => EE.emit('dispatch', action)
