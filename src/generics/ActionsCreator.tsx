import { ParamsType, objectEntries } from "../helpers";
import { dispatch } from "./dispatcher";
import { EVENTS } from "./EventEmitter";


export type IActionsType<T> = {
    [K in keyof T]: (payload: T[K] extends (...args: unknown[]) => unknown ? ParamsType<T[K]> : T[K]) => void
}

export type IBatchType<T> = Partial<{
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? ParamsType<T[K]> : T[K]
}>

export type IReducerActions<T> = Partial<{
    [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? ReturnType<T[K]> : T[K]
}>

export class ActionsCreator<T> {
    public ACTION_TYPES: { [K in keyof T]: K; };
    public ACTION_TYPES_ARRAY: Array<Extract<keyof T, string>>
    public ACTIONS: IActionsType<T>;

    public ACTIONS_DECLARATIONS: T
    public ACTIONS_ENTRIES: Array<[Extract<keyof T, string>, T[keyof T]]>

    public constructor(initialObject: T) {
        this.ACTIONS_DECLARATIONS = initialObject
        this.ACTIONS_ENTRIES = objectEntries(initialObject);
        this.ACTION_TYPES_ARRAY = this.ACTIONS_ENTRIES.map(([key]) => key)

        this.ACTION_TYPES = this.ACTIONS_ENTRIES
            .reduce(
                (acc, [type]) => ({ ...acc, [type]: type }),
                {} as { [K in keyof T]: K },
            )

        this.ACTIONS = this._reduceTypes()

        // tslint:disable-next-line: no-console
        console.log(this)
    }

    public batchDispatch = (payload: IBatchType<T>) => {
        dispatch({
            type: EVENTS.BATCH_DISPATCH,
            payload,
        })
    }

    private _reduceTypes() {
        return this
            .ACTIONS_ENTRIES
            .reduce(
                (acc, [type, value]) => {
                    const dispatchFn = value instanceof Function
                        ? (payload: Partial<unknown>) => { dispatch({ type, payload: value(payload) as T }) }
                        : (payload: Partial<unknown>) => { dispatch({ type, payload }) }

                    return { ...acc, [type]: dispatchFn }
                },
                {} as IActionsType<T>,
            )
    }

}
