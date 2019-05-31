import { EE } from './EventEmitter'

export const dispatch = (action) => EE.emit('dispatch', action)
