import { ParamsType, objectEntries } from "../helpers";
import { dispatch } from "./dispatcher";


export type IActionsType<T> = {
    [K in keyof T]: (payload: T[K] extends (...args: any) => any ? ParamsType<T[K]> : T[K]) => void
}

export type IBatchType<T> = Partial<{
    [K in keyof T]: T[K] extends (...args: any) => any ? ParamsType<T[K]> : T[K]
}>

export type IReducerActions<T> = Partial<{
    [K in keyof T]: T[K] extends (...args: any) => any ? ReturnType<T[K]> : T[K]
}>

export class ActionsCreator<T> {

    public ACTIONS_DECLARATIONS: T
    public ACTION_TYPES_ARRAY: Extract<keyof T, string>[]
    public ACTION_TYPES: { [K in keyof T]: K; };
    public ACTIONS_ENTRIES: [Extract<keyof T, string>, T[keyof T]][]
    public ACTIONS: IActionsType<T>;

    constructor(initialObject: T) {
        this.ACTIONS_DECLARATIONS = initialObject
        this.ACTIONS_ENTRIES = objectEntries(initialObject);
        this.ACTION_TYPES_ARRAY = this.ACTIONS_ENTRIES.map(([key]) => key) as Extract<keyof T, string>[]

        this.ACTION_TYPES = this.ACTIONS_ENTRIES
            .reduce(
                (acc, [type]) => ({ ...acc, [type]: type }),
                {} as { [K in keyof T]: K },
            )

        this.ACTIONS = this._reduceTypes()

        console.log(this)
    }

    public batchDispatch(payload: IBatchType<T>) {
        dispatch({
            type: 'BATCH_DISPATCH',
            payload,
        })
    }

    private _reduceTypes() {
        return this
            .ACTIONS_ENTRIES
            .reduce(
                (acc, [type, value]) => {
                    const dispatchFn = typeof value === 'function'
                        ? (payload: unknown) => dispatch({ type, payload: value(payload) })
                        : (payload: unknown) => dispatch({ type, payload })

                    return { ...acc, [type]: dispatchFn }
                },
                {} as IActionsType<T>
            )
    }

}