import { createSlice } from "@reduxjs/toolkit";
import { logInThunk } from "./logInThunk.js";


export const INITAIL_STATE_CUSTOMER = 
  {
  id: 2,
  name: "cp",
  institution_code: "INST001",
  role: "admin",
  permissions: [
  
  ]

}
export const userSlice = createSlice({
    name: 'user',
    initialState: INITAIL_STATE_CUSTOMER,
    reducers: {

        // editUserDetails: (state, action) => {
        //     state.userDetails = action.payload;
        //     state.customername = action.payload;
        //     state.password="";
        //     state.CID=-1;
        //     state.EID=-1;
        //     state.sucsses=false;
        //     state.failed=false;
        //     state.userType="";

        // },
        // editPassword: (state, action) => {
        //     state.password = action.payload;
        // },
        // editCID: (state, action) => {
        //     state.CID = action.payload;
        //     console.log(state.CID);
        // },
        //  editcustomername: (state, action) => {
        //     state.customername = action.payload;
        // },
    },


    extraReducers: (builder) => {
        //logIn
        // הוספת מקרה שהט'נק התחיל
        builder.addCase(logInThunk.pending, (state) => {
            console.log("login start");
            
        });
        // הוספת מקרה שהט'נק הסתיים בהצלחה
        builder.addCase(logInThunk.fulfilled, (state, action) => {
            state.userDetails = action.payload;
            console.log(state.userDetails);
            
        });
        // הוספת מקרה שהט'נק נכשל 
        builder.addCase(logInThunk.rejected, (state, action) => {
            console.log("action: ", action);
        });

    }
});

// export const { editUserDetails, editPassword, editCID, editcustomername } = userSlice.actions;