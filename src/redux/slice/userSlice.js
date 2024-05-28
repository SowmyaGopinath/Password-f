import { createSlice } from '@reduxjs/toolkit';

// const initialStateValue = {};

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            
        },
        logout: (state, action) => {
            state.user = null;
            state.isAuthenticated = false;
           
        },
        updateUser: (state, action) => {
            state.user = action.payload;
        }
    }
})
export const {login, logout, updateUser} = userSlice.actions;
export default userSlice.reducer;