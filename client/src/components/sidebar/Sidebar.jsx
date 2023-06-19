
import "./sidebar.css"
import { Link } from "react-router-dom"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import VideogameAssetRoundedIcon from '@mui/icons-material/VideogameAssetRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

function Sidebar(props) {

    const comp = useRef()

    const tl = useRef()

    useEffect(() => {
        const ctx = gsap.context(() => {
            tl.current = gsap
              .timeline()
              .from(".sidebarLinksContainer", {
                x: -100
              })
          }, comp);
    }, [])


    return (
        <>
            <div className="sidebarWrapper" ref={comp}>
                <div className="sidebarLinksContainer">
                    <h1>MENU</h1>
                    <Link to="/" style={{textDecoration: "none", color: "white"}}> 
                        <div onClick={() => {props.setSidebarTrigger(0)}} className="sidebarLink">
                            <HomeRoundedIcon style={{fontSize: "33px"}} />
                            <p>Home</p>
                        </div>
                    </Link>   
                    <Link to="/game" style={{textDecoration: "none", color: "white"}}> 
                        <div className="sidebarLink" onClick={() => {props.setSidebarTrigger(0)}}>
                            <VideogameAssetRoundedIcon style={{fontSize: "33px"}} />
                            <p>Games</p>
                        </div>
                    </Link>   

                    <Link to="/" style={{textDecoration: "none", color: "white"}}> 
                        <div className="sidebarLink" onClick={() => {props.setSidebarTrigger(0)}}>
                            <PaidRoundedIcon style={{fontSize: "33px"}} />
                            <p>Transactions</p>
                        </div>
                    </Link>

                    <Link to="/settings" style={{textDecoration: "none", color: "white"}}> 
                    <div className="sidebarLink" onClick={() => {props.setSidebarTrigger(0)}}>
                        <SettingsRoundedIcon style={{fontSize: "33px"}} />
                        <p>Settings</p>
                    </div>
                    </Link>   
                </div>
            </div>
        </>
    )
}

export default Sidebar;