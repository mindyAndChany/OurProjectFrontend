import { createAsyncThunk } from "@reduxjs/toolkit";

export const logInThunk = createAsyncThunk(
    'logIn',
    async (details) => {
        const res = await fetch(`https://ourprojectbackend-1.onrender.com/api/auth/logIn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*'
            },
            body: JSON.stringify({
                email: details.email,
                password: details.password
            })
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        }

        throw new Error('failed to fetch');
    }
);
