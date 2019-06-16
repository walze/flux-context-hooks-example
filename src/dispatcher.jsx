import { EE } from './EventEmitter'

/**
 * @param { { type: string, payload: unknown } } action
 */
export const dispatch = action => EE.emit('dispatch', action)
