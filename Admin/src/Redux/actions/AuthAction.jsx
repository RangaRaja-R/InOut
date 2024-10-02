import Serv from '../Services/AuthService';
const serv = Serv;


export const login = (data) => async (dispatch, getState) => {
    console.log(data);
    try {
        const res = await serv.login(data.email, data.password);
        dispatch({ type: "SET_USER", payload: res.data });
        dispatch({ type: "SET_USER_TYPE", payload: "hr" });
    }
    catch (er) {
        console.log(er);
    }
}
export const logout = () => async (dispatch, getState) => {
    try {
        
        dispatch({ type: "LOG_OUT", payload: null });
    }
    catch (er) {
        console.log(er);
    }
}

export const validate = (email) => async (dispatch, getState) => {
    try {
        const res = await serv.validate(email);
        dispatch({ type: "VALIDATE", payload: res.data.message });
        console.log(res.data.message)
    } catch (e) {
        console.log(e);
    }
}