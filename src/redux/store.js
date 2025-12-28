import { combineSlices, configureStore } from "@reduxjs/toolkit";

import { userSlice } from "./slices/USER/userSlice.js";


const reducers = combineSlices(userSlice);


export const STORE = configureStore({
    reducer: reducers,

})