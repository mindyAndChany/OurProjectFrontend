import { createAsyncThunk } from "@reduxjs/toolkit";

export const logInThunk = createAsyncThunk(
    'logIn',
    async (details) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logIn`, {
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
