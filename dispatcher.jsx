import { useContext } from 'react';

import { StoreContext } from "./Store";

/** @typedef { typeof StoreContext[1] } IDispatcher */

export const useDispatcher = () => {
    /** @type { IDispatcher } */
    const dispatcher = useContext(StoreContext)[1]

    return dispatcher
};
