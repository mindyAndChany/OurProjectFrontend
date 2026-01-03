import { createSlice } from "@reduxjs/toolkit";
import { getStudentDataThunk } from "./getStudentDataThunk.js";


export const INITAIL_STATE_STUDENTS = 
  {
  studentsData:{}
}
export const studentSlice = createSlice({
    name: 'student',
    initialState: INITAIL_STATE_STUDENTS,
    reducers: {

        // editstudentDetails: (state, action) => {
        //     state.studentDetails = action.payload;
        //     state.studentsname = action.payload;
        //     state.password="";
        //     state.CID=-1;
        //     state.EID=-1;
        //     state.sucsses=false;
        //     state.failed=false;
        //     state.studentType="";

        // },
      
    },


    extraReducers: (builder) => {
        //getStudentData
        // הוספת מקרה שהט'נק התחיל
        builder.addCase(getStudentDataThunk.pending, (state) => {
            console.log("getStudentData start");
            
        });
        // הוספת מקרה שהט'נק הסתיים בהצלחה
        builder.addCase(getStudentDataThunk.fulfilled, (state, action) => {
            state.studentDetails = action.payload;
            console.log(state.studentDetails);
            
        });
        // הוספת מקרה שהט'נק נכשל 
        builder.addCase(getStudentDataThunk.rejected, (state, action) => {
            console.log("action: ", action);
        });

    }
});

// export const { editstudentDetails, editPassword, editCID, editstudentsname } = studentSlice.actions;