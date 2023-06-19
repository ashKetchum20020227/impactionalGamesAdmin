
import "./settings.css"
import Navbar from "../../components/navbar/Navbar"
import SettingsIcon from '@mui/icons-material/Settings';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { editUsernameCall } from "../../apiCalls";
import Sidebar from "../../components/sidebar/Sidebar";
import axios from "axios";

export default function Settings() {

    const { user, dispatch } = useContext(AuthContext)

    const username = useRef()

    const [general, setGeneral] = useState(1)
    const [security, setSecurity] = useState(0)
    const [changeUsername, setChangeUsername] = useState(0)
    const [clientTheme, setClientTheme] = useState("None")

    const handleSelect = (e) => {

        var doc = document.getElementsByClassName("selected")[0]
        doc.classList.remove("selected")

        if (doc.id == 'general') {
            setGeneral(0)
        } else if (doc.id == 'security') {
            setSecurity(0)
        } else {
            setChangeUsername(0)
        }

        doc = document.getElementById(e.target.id)

        if (doc.id == 'general') {
            setGeneral(1)
        } else if (doc.id == 'security') {
            setSecurity(1)
        } else {
            setChangeUsername(1)
        }

        doc.classList.add("selected")
    }

    const handleChange = async (e) => {
        e.preventDefault()

        if (username.current.value == "") {
            alert("Empty username not accepted")
            return;
        }
        
        const res = await editUsernameCall({_id: user._id, username: username.current.value}, dispatch)
        alert("Changed")
    }

    const handleThemeChange = async (e) => {
        
        if (e.target.value == 'Christmas') {
            const res = await axios.post("/api/themes/", {type: "1", name: e.target.value})
            setClientTheme("Christmas")
        }

        else if (e.target.value == 'None') {
            const res = await axios.post("/api/themes/", {type: "0", name: e.target.value})
            setClientTheme("None")
        }

    }


    useEffect(() => {

        const getClientTheme = async () => {
            const res = await axios.post("/api/themes/getTheme")
            setClientTheme(res.data.name)
            console.log(res.data.name)
        }

        getClientTheme()

    }, [])
    
    return (
        <>
            <Navbar  />
            <div className="settingsSidebarContainer">
                <Sidebar />
            </div>
            <div className={"globalSettingsMainContainer"}>
                <header><SettingsIcon style={{color: "#52C71Bff"}} />{" Global Settings"}</header>
                <div className="globalSettingsMain">
                    <div className="globalSettingsSidebar">
                        <p id="general" onClick={(e) => {handleSelect(e)}} className="selected">General</p>
                        <p id="security" onClick={(e) => {handleSelect(e)}}>Security</p>
                        <p id="changeUsername" onClick={(e) => {handleSelect(e)}}>Change Username</p>
                    </div>       
                    {general == 1 ? <div className="globalSettingsDiv generalSettings">

                        {/* <div>
                            <p>Display Mode</p>
                            <div className="themeButton">
                                <WbSunnyIcon style={{color: "white", fontSize: "40px"}} />
                                <label class="switch">
                                    <input type="checkbox" checked={true} />
                                    <span class="slider round"></span>
                                </label>
                                <ModeNightIcon style={{color: "#B64FC8ff", fontSize: "40px"}} />
                            </div>
                        </div> */}

                        <div>
                            <p>Client Website Theme</p>
                            <select onChange={(e) => handleThemeChange(e)}>
                                <option selected={clientTheme == "None" ? 1 : 0}>None</option>
                                <option selected={clientTheme == "Christmas" ? 1 : 0}>Christmas</option>
                                <option selected={clientTheme == "Halloween" ? 1 : 0}>Halloween</option>
                                <option selected={clientTheme == "Holi" ? 1 : 0}>Holi</option>
                            </select>
                        </div>

                        <div>
                            <p>Language</p>
                            <select>
                                <option>English</option>
                                <option>French</option>
                                <option>Indonesian</option>
                                <option>Japanese</option>
                            </select>
                        </div>
                    </div> : ""}      


                    {security == 1 ? <div className="globalSettingsDiv securitySettings">
                        <div>
                            <form>
                                <div>
                                    <label>Enter current Login Email</label>
                                    <input type="text"></input>
                                </div>

                                <div>
                                    <label>Enter current Login Password</label>
                                    <input type="password"></input>
                                </div>

                                <div>
                                    <label>Enter new Login Password</label>
                                    <input type="password"></input>
                                </div>

                                <button>Change</button>
                            </form>
                        </div>

                    </div> : ""}   

                    {changeUsername == 1 ? <div className="globalSettingsDiv securitySettings">
                        <div>
                            <form onSubmit={(e) => {handleChange(e)}}>
                                <div>
                                    <label>Username</label>
                                    <input required ref={username} type="text" placeholder={user.username}></input>
                                </div>

                                <div>
                                    <label>Enter your Password</label>
                                    <input type="password"></input>
                                </div>

                                <button type="submit">Change</button>
                            </form>
                        </div>

                    </div> : ""}   
                </div>
            </div>
        </>
    )
}
