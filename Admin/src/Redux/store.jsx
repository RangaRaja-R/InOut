import UserListReducer from "./reducers/UserListReducer";
import { configureStore } from '@reduxjs/toolkit'
export const API_URL = "";

export default configureStore({
    reducer:{
        users: UserListReducer,
        user: AuthReducer
    }
});