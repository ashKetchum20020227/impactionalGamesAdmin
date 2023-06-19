
export const LoginStart = (userCredentials) => ({
    type: "LOGIN_START",
})

export const LoginSuccess = (user) => ({
    type: "Login_Success",
    payload: user
})

export const LoginFailure = (error) => ({
    type: "Login_Failure",
    payload: error
})