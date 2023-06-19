
import axios from "axios"

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({type: "LOGIN_START"});

    try {
        const res = await axios.post("/api/auth/login/email", userCredentials);
        if (res.data.username || res.data.username == "") {
            alert("Success")
            dispatch({type: "LOGIN_SUCCESS", payload: res.data});
            localStorage.setItem("refreshToken", res.data.refreshToken)
        }
        else {
            console.log(res.data)
            dispatch({type: "LOGIN_FAILURE", payload: res.data});
        }
    } catch(err) {
        dispatch({type: "LOGIN_FAILURE", payload: err});
    }
}

export const loginCallMobile = async (userCredentials, dispatch) => {
    dispatch({type: "LOGIN_START"});

    try {
        const res = await axios.post("/api/auth/login/mobile", userCredentials);
        if (res.data.username) {
            dispatch({type: "LOGIN_SUCCESS", payload: res.data});
            localStorage.setItem("refreshToken", res.data.refreshToken)
        }
        else {
            dispatch({type: "LOGIN_FAILURE", payload: res.data});
        }
    } catch(err) {
        dispatch({type: "LOGIN_FAILURE", payload: err});
    }
}

export const refresh = async (userCredentials, dispatch) => {
    try {
        const res = await axios.post("/api/auth/refresh", userCredentials);
        if (res.data.username) {
            dispatch({type: "REFRESH_SUCCESS", payload: res.data});
            localStorage.setItem("refreshToken", res.data.refreshToken)
        }
    } catch(err) {
        console.log("Error")
    }
}

export const logout = async (dispatch) => {
    dispatch({type: "LOGOUT"})
    localStorage.removeItem("refreshToken")
}

export const editUsernameCall = async (userCredentials, dispatch) => {
    try {
        const res = await axios.post("/api/admins/editUsername", userCredentials);
        // console.log(res)
        if (res.data.username) {
            dispatch({type: "EDIT_SUCCESS", payload: res.data});
            return "changed"
        }
    } catch(err) {
        console.log(err)
    }
}

export const addGameCall = async (data) => {
    try {
        const res = await axios.post("/api/games/add", data, {
            headers: {
            "Content-type": "multipart/form-data",
        }});
        alert(res.data)
        return res.data
    } catch(err) {
        console.log(err)
    } 
}