
import "./registeredusers.css"
import CloseIcon from '@material-ui/icons/Close';
import { useState, useEffect } from "react";
import axios from "axios"
import PlayerInfoPopup from "../playerInfoPopup/PlayerInfoPopup";
import moment from 'moment'

function RegisteredUsers(props) {

    const [users, setUsers] = useState(null);

    const [registeredUsersType, setRegisteredUsersType] = useState("Daily");

    const [triggerPlayerProfile, setTriggerPlayerProfile] = useState(0);

    const handleShowProfile = (id) => {
        setTriggerPlayerProfile(id)
    }

    const handleChangeRegisteredUsersType = (e) => {
        setRegisteredUsersType(e.target.value)
    }

    const handleFetchRegisteredUsers = async () => {

        if (registeredUsersType == "Daily") {

            const date = document.getElementById("registeredUsersDate").value

            const res = await axios.post("/api/users/getRegisteredUsersDetailsDaily", {date: date})
            setUsers(res.data)

        } else if (registeredUsersType == "FromTo") {

            const fromDate = document.getElementById("registeredUsersFromDate").value
            const toDate = document.getElementById("registeredUsersToDate").value

            const res = await axios.post("/api/users/getRegisteredUsersDetailsFromTo", {fromDate: fromDate, toDate: toDate})
            setUsers(res.data)

        } else if (registeredUsersType == "Monthly") {

            const registeredUsersMonthAndYear = document.getElementById("registeredUsersMonthAndYear").value

            const res = await axios.post("/api/users/getRegisteredUsersDetailsMonthly", {monthAndYear: registeredUsersMonthAndYear})
            setUsers(res.data)

        } else if (registeredUsersType == "Yearly") {

            const registeredUsersYear = document.getElementById("registeredUsersYear").value

            const res = await axios.post("/api/users/getRegisteredUsersDetailsYearly", {year: registeredUsersYear})
            setUsers(res.data)
        }
    }

    useEffect(() => {
        const getRegisteredUsers = async () => {
            const res = await axios.post("/api/users/getRegisteredUsers")
            setUsers(res.data)
        }
        
        getRegisteredUsers()
    }, [])

    return (
        <>  
            {triggerPlayerProfile != 0 ? <PlayerInfoPopup setTriggerPlayerProfile={setTriggerPlayerProfile} playerId={triggerPlayerProfile} /> : ""}
            {users ? <div className="registeredUsersPopupOuter">
                <div className="registeredUsersPopupInner">

                    <div className="calendarContainer">
                        <select onChange={(e) => handleChangeRegisteredUsersType(e)}>
                            <option selected={registeredUsersType == 'Daily' ? 1 : 0}>Daily</option>
                            <option selected={registeredUsersType == 'FromTo' ? 1 : 0}>FromTo</option>
                            <option selected={registeredUsersType == 'Monthly' ? 1 : 0}>Monthly</option>
                            <option selected={registeredUsersType == 'Yearly' ? 1 : 0}>Yearly</option>
                        </select>

                        {registeredUsersType == 'Daily' ? 
                            <div>
                                <label>Select Date</label>
                                <input id="registeredUsersDate" defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} type="date"></input>
                            </div> 
                            
                            : ""
                        }

                        {registeredUsersType == 'FromTo' ? 
                            <div>
                                <label>Select From Day</label>
                                <input id="registeredUsersFromDate" defaultValue={new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getFullYear() + "-" + (new Date(Date.now()- 6 * 24 * 60 * 60 * 1000).getMonth() + 1) + "-" + new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getDate()} type="date"></input>
                                <label>Select To Day</label>
                                <input id="registeredUsersToDate" defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} type="date"></input>
                            </div> 
                            
                            : ""
                        }

                        {registeredUsersType == 'Monthly' ? 
                            
                            <div>
                                <label>Select Month and Year</label>
                                <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="registeredUsersMonthAndYear" type="date"></input>
                            </div>
                            
                            : ""
                        }

                        {registeredUsersType == 'Yearly' ? 
                            <div>
                                <label>Select Year</label>  
                                <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="registeredUsersYear" type="date"></input>
                            </div> 
                            
                            : ""
                        }

                        <button onClick={handleFetchRegisteredUsers}>GET</button> Total = {users.length}

                    </div>
                    
                    <header>
                        <h2>Registered Users</h2>
                        <CloseIcon style={{cursor: "pointer", marginRight: "20px"}} onClick={() => props.setTrigger(0)} />
                    </header>

                    {users ? <div className="registeredUsersContainer">
                        <table>
                            <tr>
                                <th>UserId</th>
                                <th>Username</th>
                                <th>Joined</th>
                            </tr>

                            {users.map(user => {
                                return (
                                    <tr>
                                        <td>{user._id}</td>
                                        <td>{user.username}</td>
                                        <td>{moment(new Date(user.createdAt)).fromNow()}</td>
                                        <td><button onClick={() => {handleShowProfile(user._id)}}>Show Profile</button></td>
                                    </tr>
                                )
                            })}

                        </table>
                    </div> : ""}
                </div>
            </div> : ""}
        </>
    )
}

export default RegisteredUsers