
import "./login.css"
import impactional from "../../Assets/impactional1.png.webp"
import games from "../../Assets/games1.png.webp"
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded';
import { useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react";
import { loginCall, loginCallMobile } from "../../apiCalls"
import { useNavigate } from "react-router-dom"

export default function Login() {

    const email = useRef()
    const password = useRef()

    const navigate = useNavigate()

    const {user, dispatch} = useContext(AuthContext)

    const handleLogin = (e) => {
        e.preventDefault()
        loginCall({email: email.current.value, password: password.current.value}, dispatch)
        setTimeout(() => {
            navigate("/")
        }, 1000)
    }

    return (
        <>
            <div className="loginWrapper">
                <div className="formContainer">
                    <form onSubmit={(e) => {handleLogin(e)}}>
                        <header><AdminPanelSettingsRoundedIcon style={{fontSize: "50px"}} />ADMIN LOGIN</header>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input ref={email} id="email" type="text"></input>
                        </div>

                        <div>
                            <label htmlFor="password">Password</label>
                            <input ref={password} id="password" type="password"></input>
                        </div>
                        
                        <p className="forgotPassword">Forgot Password ?</p>

                        <button type="submit">Login</button>
                    </form>
                </div>
                <div className="logoContainer">
                    <img src={impactional}></img>
                    <img src={games}></img>
                </div>
            </div>
        </>
    )
}
