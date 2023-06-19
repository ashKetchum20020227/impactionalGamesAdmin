import "./home.css"
import gorilla from "../../Assets/gorilla.png"
import Navbar from "../../components/navbar/Navbar"
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import TourRoundedIcon from '@mui/icons-material/TourRounded';
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import PlayerInfoPopup from "../../components/playerInfoPopup/PlayerInfoPopup";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import RegisteredUsers from "../../components/registeredUsers/RegisteredUsers";
import WebsiteVisitsPopup from "../../components/websiteVisitsPopup/WebsiteVisitsPopup";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

export const options1 = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'No. of registered users vs days',
        },
    },
};

export const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'No. of website visits vs days',
      },
    },
  };
  
const labels = ['Today', 'Yesterday', 'This week', 'Past 15 days', 'This month'];

export default function Home() {

    const {user} = useContext(AuthContext)

    const [triggerPlayerProfile, setTriggerPlayerProfile] = useState(0)

    const [recentTransactions, setRecentTransactions] = useState([])

    const [playerId, setPlayerId] = useState(null)

    const [registeredUsersCount, setRegisteredUsersCount] = useState(0)

    const [visitsCount, setVisitsCount] = useState(0)

    const [visits, setVisits] = useState(null)

    const [registeredUsersTrigger, setRegisteredUsersTrigger] = useState(0);

    const [websiteVisitsTrigger, setWebsiteVisitsTrigger] = useState(0);

    const [data1, setData1] = useState(null)

    const [data2, setData2] = useState(null)

    const [graphType, setGraphType] = useState("Weekly")
    const [registeredUsersGraphType, setRegisteredUsersGraphType] = useState("Weekly")

    const handleSelectPlayer = (id) => {
        setPlayerId(id)
        setTriggerPlayerProfile(1)
    }

    const handleShowRegisteredUsers = () => {
        setRegisteredUsersTrigger(1)
    }

    const handleShowWebsiteVisits = () => {
        setWebsiteVisitsTrigger(1)
    }

    const handleChangeGraphType = (e) => {
        setGraphType(e.target.value)
    }

    const handleChangeRegisteredUsersGraphType = (e) => {
        setRegisteredUsersGraphType(e.target.value)
    }

    const handleFetchRegisteredUsers = async () => {
        if (registeredUsersGraphType == 'Daily') {

            const fromDate = document.getElementById("ruFromDate")
            const toDate = document.getElementById("ruToDate")

            const res = await axios.post("/api/users/getRegisteredUsersDaily", {fromDate: fromDate.value, toDate: toDate.value})

            var labels = []

            // alert(fromDate.value)

            var temp = new Date(fromDate.value)

            for (var i = 0; i <= new Date(toDate.value).getDate() - new Date(fromDate.value).getDate(); i++) {
                labels.push(temp.toLocaleDateString())
                temp = new Date(temp.getTime() + 24 * 60 * 60 * 1000)
            }

            setData1({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })
        } 

        else if (registeredUsersGraphType == 'Weekly') {

            const monthAndYearForWeek = document.getElementById("ruMonthAndYearForWeek")

            const res = await axios.post("/api/users/getRegisteredUsersWeekly", {monthAndYearForWeek: monthAndYearForWeek.value})

            var labels = ["Last week", "Third week", "Second Week", "First Week"]

            setData1({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })

        }

        else if (registeredUsersGraphType == 'Monthly') {

            const yearForMonth = document.getElementById("ruYearForMonth")

            const res = await axios.post("/api/users/getRegisteredUsersMonthly", {yearForMonth: yearForMonth.value})

            var labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
                            "November", "December"]

            setData1({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })
        }

        else if (registeredUsersGraphType == 'Yearly') {

            const fromYear = document.getElementById("ruFromYear")
            const toYear = document.getElementById("ruToYear")

            const res = await axios.post("/api/users/getRegisteredUsersYearly", {fromYear: fromYear.value, toYear: toYear.value})

            var labels = []

            var temp = new Date(fromYear.value).getFullYear()

            labels.push(temp)

            while (temp != new Date(toYear.value).getFullYear()) {
                temp += 1
                labels.push(temp)
            }

            setData1({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })

        }
    }


    const handleFetchNewData = async () => {
        if (graphType == 'Daily') {

            const fromDate = document.getElementById("fromDate")
            const toDate = document.getElementById("toDate")

            const res = await axios.post("/api/users/getVisitsDaily", {fromDate: fromDate.value, toDate: toDate.value})

            var labels = []

            // alert(fromDate.value)

            var temp = new Date(fromDate.value)

            for (var i = 0; i <= new Date(toDate.value).getDate() - new Date(fromDate.value).getDate(); i++) {
                labels.push(temp.toLocaleDateString())
                temp = new Date(temp.getTime() + 24 * 60 * 60 * 1000)
            }

            setData2({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })
        } 

        else if (graphType == 'Weekly') {

            const monthAndYearForWeek = document.getElementById("monthAndYearForWeek")

            const res = await axios.post("/api/users/getVisitsWeekly", {monthAndYearForWeek: monthAndYearForWeek.value})

            var labels = []

            var date = new Date(Date.now());

            date = new Date(date.getFullYear(), date.getMonth()+1, 0)

            for (var i = 0; i < 4; i++) {
                labels.push(date.toLocaleDateString())
                date = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000)
            }

            setData2({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })

        }

        else if (graphType == 'Monthly') {

            const yearForMonth = document.getElementById("yearForMonth")

            const res = await axios.post("/api/users/getVisitsMonthly", {yearForMonth: yearForMonth.value})

            var labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
                            "November", "December"]

            setData2({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })
        }

        else if (graphType == 'Yearly') {

            const fromYear = document.getElementById("fromYear")
            const toYear = document.getElementById("toYear")

            const res = await axios.post("/api/users/getVisitsYearly", {fromYear: fromYear.value, toYear: toYear.value})

            var labels = []

            var temp = new Date(fromYear.value).getFullYear()

            labels.push(temp)

            while (temp != new Date(toYear.value).getFullYear()) {
                temp += 1
                labels.push(temp)
            }

            setData2({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })

        }
    }


    useEffect(() => {

        const getTransactions = async () => {
            const res = await axios.post("/api/transactions/liveTransactions")
            setRecentTransactions(res.data)
            // console.log(res.data)
        }

        const getRegisteredUsers = async () => {
            const res = await axios.post("/api/users/getRegisteredUsersCount");
            setRegisteredUsersCount(res.data)
        }

        const getWebsiteVisits = async () => {
            const res = await axios.post("/api/users/getVisitDetailsToday")
            setVisitsCount(res.data.length)
            setVisits(res.data)
        }

        const getVisitsPast4Weeks = async () => {
            const res = await axios.post("/api/users/getVisitsWeekly", {monthAndYearForWeek: new Date(Date.now())})

            var labels = []

            var date = new Date(Date.now());

            date = new Date(date.getFullYear(), date.getMonth()+1, 0)

            for (var i = 0; i < 4; i++) {
                labels.push(date.toLocaleDateString())
                date = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000)
            }
        
            setData2({
                labels: labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data:  res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })
        }

        const getData1 = async () => {
            const res = await axios.post("/api/users/getUsersAccordingToTime")
            setData1({
                labels,
                datasets: [
                  {
                    label: 'Dataset 1',
                    data: res.data,
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgb(53, 162, 235)',
                  },
                ],
            })
        }

        getTransactions()
        getRegisteredUsers()
        getWebsiteVisits()
        getData1()
        getVisitsPast4Weeks()
        // handleFetchNewData()

    }, [])

    return (
        <>  
            {websiteVisitsTrigger == 1 ? <WebsiteVisitsPopup visits={visits} setWebsiteVisitsTrigger={setWebsiteVisitsTrigger} /> : ""}
            {registeredUsersTrigger == 1 ? <RegisteredUsers setTrigger={setRegisteredUsersTrigger} /> : ""}
            {triggerPlayerProfile == 1 ? <PlayerInfoPopup setTriggerPlayerProfile={setTriggerPlayerProfile} playerId={playerId} /> : ""}
            <Navbar />
            {user ?
            <div className="homeWrapper">
            <div className="homeSidebarContainer"><Sidebar /></div>
            <div className="homeMainContainer">
                <div className="homeRow1">
                    {data2 ? <div className="graphsContainer">

                        <div className="calendarContainer">
                            <select onChange={(e) => handleChangeGraphType(e)}>
                                <option selected={graphType == 'Daily' ? 1 : 0}>Daily</option>
                                <option selected={graphType == 'Weekly' ? 1 : 0}>Weekly</option>
                                <option selected={graphType == 'Monthly' ? 1 : 0}>Monthly</option>
                                <option selected={graphType == 'Yearly' ? 1 : 0}>Yearly</option>
                            </select>

                            {graphType == 'Daily' ? 
                                <div>
                                    <label>Select From Day</label>
                                    <input id="fromDate" defaultValue={new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getFullYear() + "-" + (new Date(Date.now()- 6 * 24 * 60 * 60 * 1000).getMonth() + 1) + "-" + new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getDate()} type="date"></input>
                                    <label>Select To Day</label>
                                    <input id="toDate" defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} type="date"></input>
                                </div> 
                                
                                : ""
                            }

                            {graphType == 'Weekly' ? 
                                <div>
                                    <label>Select Month and Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="monthAndYearForWeek" type="date"></input>
                                </div> 
                                
                                : ""
                            }

                            {graphType == 'Monthly' ? 
                                
                                <div>
                                    <label>Select Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="yearForMonth" type="date"></input>
                                </div>
                                
                                : ""
                            }

                            {graphType == 'Yearly' ? 
                                <div>
                                    <label>Select From Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="fromYear" type="date"></input>
                                    <label>Select To Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="toYear" type="date"></input>
                                </div> 
                                
                                : ""
                            }

                            <button onClick={handleFetchNewData}>GET</button>

                        </div>
                    
                        <Line options={options2} data={data2} />
                    
                    </div> : ""}
                    <div className="websiteCount">

                        <h2>Website Visits Today</h2>
                        <TourRoundedIcon style={{fontSize: "100px", color: "#52C71Bff"}} />
                        <h2>{visitsCount}</h2>
                        <p style={{cursor: "pointer"}} onClick={handleShowWebsiteVisits}>Click to view visits and apply filters</p>
                    </div>
                </div>

                <div className="homeRow1">
                    {data1 ? 
                    <div className="graphsContainer">
                            
                    <div className="calendarContainer">
                            <select onChange={(e) => handleChangeRegisteredUsersGraphType(e)}>
                                <option selected={registeredUsersGraphType == 'Daily' ? 1 : 0}>Daily</option>
                                <option selected={registeredUsersGraphType == 'Weekly' ? 1 : 0}>Weekly</option>
                                <option selected={registeredUsersGraphType == 'Monthly' ? 1 : 0}>Monthly</option>
                                <option selected={registeredUsersGraphType == 'Yearly' ? 1 : 0}>Yearly</option>
                            </select>

                            {registeredUsersGraphType == 'Daily' ? 
                                <div>
                                    <label>Select From Day</label>
                                    <input id="ruFromDate" defaultValue={new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getFullYear() + "-" + (new Date(Date.now()- 6 * 24 * 60 * 60 * 1000).getMonth() + 1) + "-" + new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).getDate()} type="date"></input>
                                    <label>Select To Day</label>
                                    <input id="ruToDate" defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} type="date"></input>
                                </div> 
                                
                                : ""
                            }

                            {registeredUsersGraphType == 'Weekly' ? 
                                <div>
                                    <label>Select Month and Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="ruMonthAndYearForWeek" type="date"></input>
                                </div> 
                                
                                : ""
                            }

                            {registeredUsersGraphType == 'Monthly' ? 
                                
                                <div>
                                    <label>Select Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="ruYearForMonth" type="date"></input>
                                </div>
                                
                                : ""
                            }

                            {registeredUsersGraphType == 'Yearly' ? 
                                <div>
                                    <label>Select From Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="ruFromYear" type="date"></input>
                                    <label>Select To Year</label>
                                    <input defaultValue={new Date(Date.now()).getFullYear() + "-" + (new Date(Date.now()).getMonth()+1) + "-" + new Date(Date.now()).getDate()} id="ruToYear" type="date"></input>
                                </div> 
                                
                                : ""
                            }

                            <button onClick={handleFetchRegisteredUsers}>GET</button>

                        </div>

                        <Bar options={options1} data={data1} />
                        
                    </div> 
                    
                    : ""

                    }

                    <div className="registeredUsersCount">
                        <h2>Registered Users Count</h2>
                        <PeopleOutlineRoundedIcon style={{fontSize: "100px", color: "rgb(63, 116, 250)"}} />
                        <h2>{registeredUsersCount}</h2>
                        <p onClick={handleShowRegisteredUsers} style={{cursor: "pointer"}}>Click to view registered users and apply filters</p>
                    </div>
                </div>

                <div className="homeRow2">
                    <div className="transactionsContainer">
                        <h1>Recent Transactions</h1>
                        {recentTransactions.length != 0 ? <table>
                            <tr>
                                <th>User</th>
                                <th>Payment Mode</th>
                                <th>Transaction Type</th>
                                <th>Amount</th>
                            </tr>
                            {recentTransactions.map((transaction) => {
                                return (
                                    <tr>
                                        <td className="user" onClick={()=>{handleSelectPlayer(transaction.userId)}}>{transaction.username}</td>
                                        <td className="paymentMode">{transaction.paymentMode}</td> 
                                        <td className="transactionType">{transaction.transactionType}</td> 
                                        <td className="amount">$ {transaction.amount}</td>
                                    </tr>
                                )
                            })}
                            
                        </table> : <h1>No data found</h1>}
                    </div>

                    
                </div>
            </div></div> : <div>Please Login to Continue</div> }
        </>
    )
}
