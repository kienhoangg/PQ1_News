import { createSlice } from "@reduxjs/toolkit";

const initialHome = {
    view: -1,
    runPost: [],
    loading: true
}

const home = createSlice({
    name: 'home',
    initialState: initialHome,
    reducers: {
        addView: (state, action) => {
            // const newPhoto = action.payload;
            state.view = state.view + action.payload;
        },
        updateView: (state, action) => {
            state.view = action.payload;
        },
        updateRunPosts: (state, action) => {
            state.runPost = action.payload;
        },
        updateLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});

const { reducer, actions } = home;
export const { addView, updateView, updateRunPosts, updateLoading } = actions;
export default reducer;