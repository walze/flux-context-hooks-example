import { useContext } from 'react';

import { StoreContext } from "./Store";

export const useDispatcher = () => {
    /** @type { IDispatcher } */
    const dispatcher = useContext(StoreContext)[1]

    return dispatcher
};

/** @typedef { typeof StoreContext[1] } IDispatcher */
