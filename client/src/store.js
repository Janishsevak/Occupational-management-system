import { configureStore } from '@reduxjs/toolkit';
import injuryReducer from './feture/InjurySlice';
import requestReducer from './feture/RequestSlice';

export const store = configureStore ({
    reducer: {
        injury: injuryReducer,
        request: requestReducer
    },
})