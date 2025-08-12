import { configureStore } from '@reduxjs/toolkit';
import injuryReducer from './feture/InjurySlice';

export const store = configureStore ({
    reducer: {
        injury: injuryReducer,
    },
})