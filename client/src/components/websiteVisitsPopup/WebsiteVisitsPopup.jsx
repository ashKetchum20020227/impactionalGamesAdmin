
import "./websitevisitspopup.css"
import CloseIcon from '@material-ui/icons/Close';
import PlayerInfoPopup from "../playerInfoPopup/PlayerInfoPopup";
import { useEffect, useState } from "react";
import axios from "axios"

function WebsiteVisitsPopup(props) {

    const [triggerPlayerProfile, setTriggerPlayerProfile] = useState(0);

    const [websiteVisitsType, setWebsiteVisitsType] = useState("Daily");

    const [visits, setVisits] = useState(null)

    const handleShowProfile = (id) => {
        setTriggerPlayerProfile(id)
    }

    const handleChangeWebsiteVisitsType = (e) => {
        setWebsiteVisitsType(e.target.value)
    }

    const handleFetchWebsiteVisits = async () => {

        if (websiteVisitsType == "Daily") {

            const date = document.getElementById("websiteVisitsDate").value

            const res = await axios.post("/api/users/getVisitDetailsDaily", {date: date})
            setVisits(res.data)

        } else if (websiteVisitsType == "FromTo") {

            const fromDate = document.getElementById("websiteVisitsFromDate").value
            const toDate = document.getElementById("websiteVisitsToDate").value

            const res = await axios.post("/api/users/getVisitDetailsFromTo", {fromDate: fromDate, toDate: toDate})
            setVisits(res.data)

        } else if (websiteVisitsType == "Monthly") {

            const websiteVisitsMonthAndYear = document.getElementById("websiteVisitsMonthAndYear").value

            const res = await axios.post("/api/users/getVisitDetailsMonthly", {monthAndYear: websiteVisitsMonthAndYear})
            setVisits(res.data)

        } else if (websiteVisitsType == "Yearly") {

            const websiteVisitsYear = document.getElementById("websiteVisitsYear").value

            const res = await axios.post("/api/users/getVisitDetailsYearly", {year: websiteVisitsYear})
            setVisits(res.data)
        }
    }

    useEffect(() => {

        const todayVisits = async () => {
            const res = await axios.post("/api/users/getVisitDetailsToday")
            setVisits(res.data)
        }

        if (visits == null) {
            todayVisits()
        }

    }, [])

    return (
       <>
            {triggerPlayerProfile != 0 ? <PlayerInfoPopup setTriggerPlayerProfile={setTriggerPlayerProfile} playerId={triggerPlayerProfile} /> : ""}
            {visits ? <div className="websiteVisitsPopupOuter">
                <div className="websiteVisitsPopupInner">

                    <div className="calendarContainer">
                        <select onChange={(e) => handleChangeWebsiteVisitsType(e)}>
                            <option selected={websiteVisitsType == 'Daily' ? 1 : 0}>Daily</option>
                            <option selected={websiteVisitsType == 'FromTo' ? 1 : 0}>FromTo</option>
                            <option selected={websiteVisitsType == 'Monthly' ? 1 : 0}>Monthly</option>
                            <option selected={websiteVisitsType == 'Yearly' ? 1 : 0}>Yearly</option>
                        </select>

                        {websiteVisitsType == 'Daily' ? 
                            <div>
                                <label>Select Date</label>
                                <input id="websiteVisitsDate" defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} type="date"></input>
                            </div> 
                            
                            : ""
                        }

                        {websiteVisitsType == 'FromTo' ? 
                            <div>
                                <label>Select From Day</label>
                                <input id="websiteVisitsFromDate" defaultValue={new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getFullYear() + "-" + (new Date(Date.now()- 6 * 24 * 60 * 60 * 1000).getMonth() + 1) + "-" + new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getDate()} type="date"></input>
                                <label>Select To Day</label>
                                <input id="websiteVisitsToDate" defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} type="date"></input>
                            </div> 
                            
                            : ""
                        }

                        {websiteVisitsType == 'Monthly' ? 
                            
                            <div>
                                <label>Select Month and Year</label>
                                <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="websiteVisitsMonthAndYear" type="date"></input>
                            </div>
                            
                            : ""
                        }

                        {websiteVisitsType == 'Yearly' ? 
                            <div>
                                <label>Select Year</label>  
                                <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="websiteVisitsYear" type="date"></input>
                            </div> 
                            
                            : ""
                        }

                        <button onClick={handleFetchWebsiteVisits}>GET</button> Total = {visits.length}

                    </div>

                    <header>
                        <h2>Website Visits</h2>
                        <CloseIcon style={{cursor: "pointer", marginRight: "20px"}} onClick={() => props.setWebsiteVisitsTrigger(0)} />
                    </header>

                    <div className="websiteVisitsContainer">
                        <table>
                            <tr>
                                <th>User ID</th>    
                                <th>IP_Address</th>
                                <th>City / Country</th>
                            </tr>
                            {
                                visits.map(visit => {
                                    return (
                                        <tr className="websiteVisit">
                                            <td className="tableUserId" onClick={() => {handleShowProfile(visit.userId)}}>{visit.userId == "" ? "N/A" : visit.userId}</td>
                                            <td>{JSON.parse(visit.place).ip_address}</td>
                                            <td style={{display: "flex", alignItems: "center", gap: "2px"}}>
                                                <p>{JSON.parse(visit.place).city}</p>
                                                <p>{"  /  "}</p>
                                                <p>{JSON.parse(visit.place).country}</p>
                                                <p>{JSON.parse(visit.place).flag.emoji}</p>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </table>
                    </div>
                </div>
            </div> : ""}
       </>
    )
}

export default WebsiteVisitsPopup