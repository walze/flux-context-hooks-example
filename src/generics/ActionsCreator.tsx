import { objectKeys } from "../helpers";
import { dispatch } from "./dispatcher";


export type IDecoratedActions<T> = {
    [K in keyof T]: (payload: T[K]) => void
}

export class ActionsCreator<T> {

    public ACTIONS_DECLARATIONS: T
    public ACTION_TYPES_ARRAY: Extract<keyof T, string>[]
    public ACTION_TYPES: { [K in keyof T]: K; };
    public useActions: () => IDecoratedActions<T>;

    constructor(initialObject: T) {
        this.ACTIONS_DECLARATIONS = initialObject
        this.ACTION_TYPES_ARRAY = objectKeys(this.ACTIONS_DECLARATIONS)

        this.ACTION_TYPES = this.ACTION_TYPES_ARRAY
            .reduce(
                (acc, type) => ({ ...acc, [type]: type }),
                {} as { [K in keyof T]: K },
            )

        this.useActions = (() => {
            const reducedTypes: IDecoratedActions<T> = this._reduceTypes()

            return () => reducedTypes
        })()
    }

    public batchDispatch(payload: Partial<T>) {
        dispatch({
            type: 'BATCH_DISPATCH',
            payload,
        })
    }

    private _reduceTypes() {
        return this
            .ACTION_TYPES_ARRAY
            .reduce(
                (acc, type) => {
                    const dispatchFn = (payload: unknown) => dispatch({ type, payload })

                    return { ...acc, [type]: dispatchFn }
                },
                {} as IDecoratedActions<T>
            )
    }

}