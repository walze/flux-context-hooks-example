import { ParamsType, objectEntries } from "../helpers"
import { dispatch } from "./dispatcher"
import { EVENTS } from "./EventEmitter"


export type IActionsType<T> = {
  [K in keyof T]: (
    payload: T[K] extends (...args: unknown[]) => unknown ? ParamsType<T[K]> : T[K],
  ) => T[K] extends (...args: unknown[]) => unknown ? ReturnType<T[K]> : T[K]
}

export type IBatchType<T> = Partial<{
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? ParamsType<T[K]> : T[K]
}>

export type IReducerActions<T> = Partial<{
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? ReturnType<T[K]> : T[K]
}>

export const createActions = <T, _>(initial: T) => {
  const Actions = objectEntries(initial)
    .reduce(
      (acc, [type, value]) => {
        const dispatchFn = (_payload: Partial<unknown>) => {
          const payload = value instanceof Function
            ? value(_payload) as T
            : _payload

          dispatch({ type: type as keyof T, payload })
        }

        return { ...acc, [type]: dispatchFn }
      },
      {} as IActionsType<T>,
    )

  const batchDispatch = (payload: IBatchType<T>) => {
    dispatch({
      type: EVENTS.BATCH_DISPATCH,
      payload,
    })
  }

  return { Actions, batchDispatch }
}
