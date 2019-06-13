import { EE } from './EventEmitter'

/**
 * @param {unknown} action
 */
export const dispatch = action => EE.emit('dispatch', action)
