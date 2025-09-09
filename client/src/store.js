import { configureStore } from '@reduxjs/toolkit';
import { injuryApi } from './feature/injuryapi';
import localstatereducer from './feature/localstateSlice.js'
import { requestApi } from './feature/requestapi.js';

export const store = configureStore ({
    reducer: {
        [injuryApi.reducerPath]: injuryApi.reducer,
        [requestApi.reducerPath]: requestApi.reducer,
        ui:localstatereducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(injuryApi.middleware)
      .concat(requestApi.middleware)
})