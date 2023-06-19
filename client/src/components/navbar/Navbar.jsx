import "./navbar.css"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import gorilla from "../../Assets/gorilla.png"
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Link } from "react-router-dom"
import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logout } from "../../apiCalls";
import impactional from "../../Assets/impactional1.png.webp"
import games from "../../Assets/games1.png.webp"
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Sidebar from "../sidebar/Sidebar"
import { gsap } from "gsap";

export default function Navbar() {

    const [trigger, setTrigger] = useState(0);

    const {user, dispatch} = useContext(AuthContext)

    const [sidebarTrigger, setSidebarTrigger] = useState(0);

    const handleLogout = async () => {
        logout(dispatch)
    }

    const comp = useRef();

    useEffect(() => {
        let ctx = gsap.context(() => {
            // use scoped selectors
            gsap.to(".hamburgerContainer", { rotation: 360 });

            // t1.current = gsap.timeline().from(".navSidebarContainer", {
            //     x: 10
            // })
            
          }, comp);
          
          return () => ctx.revert();
    })

    return (
        <>
            <div ref={comp} className="navbarWrapper">
                <div className="hamburgerContainer" onClick={() => {setSidebarTrigger(!sidebarTrigger)}}>
                    {sidebarTrigger == 0 ? <MenuIcon /> : <CloseIcon />}
                </div>

                <div className="logoContainer">
                    <img src={impactional} style={{width: "200px"}}></img>
                    <img src={games} style={{width: "200px", height: "50px"}}></img>
                </div>
                {user ? <div className="navProfileContainer">
                    <img src={gorilla}></img>
                    <p>{user.username}</p>

                    <div onClick={handleLogout} className="logoutContainer">
                        <LogoutRoundedIcon style={{color: "red", marginRight: "5px"}} />
                        <p>Logout</p>
                    </div> 
                    {/* <div className={"profileDropDown"}>
                        <div className="header">
                            <div className="userInfo">
                                <img className="sideProfileImage" src={gorilla}></img>
                                <h3>Ashish Reddy</h3>
                            </div>
                            <div className="globalSettings">
                                <SettingsIcon style={{color: "white"}} />
                                <p style={{margin: 0, color: "white"}}>Global Settings</p>
                            </div>
                        </div>

                        <div className="linksContainer">
                            <div className="dropdownLink">
                                <PersonIcon />
                                <p>User Information</p>
                            </div>

                            <div className="dropdownLink">
                                <StackedLineChartIcon />
                                <p>Statistics</p>
                            </div>

                            <div className="dropdownLink">
                                <AccountBalanceWalletIcon />
                                <p>Wallet</p>
                            </div>

                            <div className="dropdownLink">
                                <HistoryIcon />
                                <p>Transactions</p>
                            </div>

                            <div className="dropdownLink">
                                <SupportAgentIcon />
                                <p>Live Support</p>
                            </div>

                            <div className="dropdownLink">
                                <Diversity1Icon />
                                <p>Refer a friend</p>
                            </div>
                            
                        </div>

                        <div className="logoutContainer">
                            <LogoutIcon />
                            <p>Logout</p>
                        </div>
                    </div> */}
                </div> : 
                ""
                }
            </div>
            {sidebarTrigger == 1 ? <Sidebar setSidebarTrigger={setSidebarTrigger} /> : ""}
        </>
    )
}
