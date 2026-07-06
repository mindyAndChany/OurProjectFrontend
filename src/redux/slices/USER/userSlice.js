import { createSlice } from "@reduxjs/toolkit";
import { logInThunk } from "./logInThunk.js";

// Load user from sessionStorage if exists
const loadUserFromSession = () => {
  try {
    const savedUser = sessionStorage.getItem('userDetails');
    if (savedUser) {
      return JSON.parse(savedUser);
    }
  } catch (error) {
    console.error('Error loading user from sessionStorage:', error);
  }
  return null;
};

export const INITAIL_STATE_CUSTOMER = {
  id: 2,
  name: "cp",
  institution_code: "INST001",
  role: "admin",
  permissions: [],
  userDetails: loadUserFromSession()  // טעינת פרטי משתמש מ-sessionStorage
};
export const userSlice = createSlice({
    name: 'user',
    initialState: INITAIL_STATE_CUSTOMER,
    reducers: {
        logout: (state) => {
            state.userDetails = null;
            // Clear sessionStorage on logout
            sessionStorage.removeItem('userDetails');
        },

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
            // Save user to sessionStorage
            try {
                sessionStorage.setItem('userDetails', JSON.stringify(action.payload));
            } catch (error) {
                console.error('Error saving user to sessionStorage:', error);
            }
        });
        // הוספת מקרה שהט'נק נכשל 
        builder.addCase(logInThunk.rejected, (state, action) => {
            console.log("action: ", action);
        });

    }
});

export const { logout } = userSlice.actions;