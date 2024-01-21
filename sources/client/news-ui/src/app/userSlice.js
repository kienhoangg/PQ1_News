import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState: {
        current: {},
    },
    reducers: {},
    extraReducers: {
        GetUser: (state, action) => {
            state.current = action.payload;
        },
    }
});

const { reducer: userReducer } = userSlice;
export default userReducer;