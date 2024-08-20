import UserListReducer from "./reducers/UserListReducer";
import AuthReducer from './reducers/AuthReducer';
import { configureStore } from '@reduxjs/toolkit'
export const API_URL = "http://localhost:8000";

export default configureStore({
    reducer:{
        users: UserListReducer,
        user: AuthReducer
    }
});