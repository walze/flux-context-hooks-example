import { objectKeys } from "../helpers";
import { dispatch } from "./dispatcher";


export type IDecoratedActions<T> = {
    [K in keyof T]: (payload: T[K]) => void
}

interface ExtendedActions {
    BATCH_DISPATCH: typeof BATCH_DISPATCH,
}

type Extended<T> = {
    [K in keyof T]: T[K];
} & ExtendedActions

const BATCH_DISPATCH = () => {

}


export class ActionsCreator<T> {

    public ACTIONS_DECLARATIONS: Extended<T>
    public ACTION_TYPES_ARRAY: Extract<keyof Extended<T>, string>[]
    public ACTION_TYPES: { [K in keyof Extended<T>]: K; };
    public useActions: () => IDecoratedActions<Extended<T>>;

    constructor(T: T) {
        const initialObject = {
            ...T,
            BATCH_DISPATCH,
        }

        this.ACTIONS_DECLARATIONS = initialObject
        this.ACTION_TYPES_ARRAY = objectKeys(this.ACTIONS_DECLARATIONS)

        this.ACTION_TYPES = this.ACTION_TYPES_ARRAY
            .reduce(
                (acc, type) => ({ ...acc, [type]: type }),
                {} as { [K in keyof Extended<T>]: K },
            )

        this.useActions = (() => {
            const reducedTypes: IDecoratedActions<Extended<T>> = this._reduceTypes()

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
                {} as IDecoratedActions<Extended<T>>
            )
    }

}