import "./playerinfopopup.css"
import CloseIcon from '@material-ui/icons/Close';
import gorilla from "../../Assets/gorilla.png"
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect, useContext } from "react";
import axios from "axios"
import {Link} from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";
import moment from 'moment'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';

export default function PlayerInfoPopup(props) {

    const { user, dispatch } = useContext(AuthContext);

    const [player, setPlayer] = useState(null);

    const [transactions, setTransactions] = useState([]);

    const handleDelete = async () => {
        await axios.post("/api/users/deleteUser", {userId: player._id})
        props.setTriggerPlayerProfile(0)
    }

    const handleBlock = async () => {
        const res = await axios.post("/api/users/blockUser", {userId: player._id})
        setPlayer(res.data)
    }

    useEffect(() => {
        const getUser = async () => {
            // alert(props.playerId)
            const res = await axios.post("/api/users/getUser", {userId: props.playerId})

            const transactionsRes = await axios.post("/api/transactions/getAllTransactions", {userId: props.playerId})

            setTransactions(transactionsRes.data)

            if (res.data.username) {
                setPlayer(res.data)
            } else {
                alert(res.data)
            }
        }

        getUser();

    }, [])

    return (
        <>
            {player ? <div className="userInfoPopupOuter">
                <div className={"playerInfo userInfoPopupInner"}>
                    <header>
                        <h3>User Information</h3>
                        <CloseIcon style={{cursor: "pointer", marginRight: "20px"}} onClick={() => props.setTriggerPlayerProfile(0)} />
                    </header>
                    
                    <div className="userInfoContainer">
                        <div className="profileLikes">
                            <FavoriteIcon style={{color: "tomato"}} />
                            <p>{player.profileLikes.length}</p>
                        </div>

                        <div className="userInfo">
                            <img src={gorilla}></img>
                            {player ? <h2>{player.username}</h2> : <h2>Username</h2>}
                            {player ? <p>User Id: {player._id}</p> : <p>User Id</p>}
                        </div>

                        <div className="userDeleteBlock">
                            <button onClick={handleDelete} className="userDeleteButton"><DeleteRoundedIcon />
                            <p>Delete</p></button>

                            <button onClick={handleBlock} className="userBlockButton"><BlockRoundedIcon />
                            <p>{player.blocked == "0" ? "Block" : "Unblock"}</p></button>
                        </div>
                    </div>

                    <div className="transactionHistory">
                        <header><h3>Transaction History</h3></header>
                        {transactions.length == 0 ? <div className="userRecentTransactions">
                                <img src={"https://cdn.iconscout.com/icon/premium/png-256-thumb/no-data-found-1965030-1662565.png"}></img>
                                <p>Oops there is no data yet</p>
                            </div> : 
                            <table>
                                <tr>
                                    <th>Payment Mode</th>
                                    <th>Transaction Type</th>
                                    <th>Amount</th>
                                    <th>Time</th>
                                </tr>
                                {transactions.map((transaction) => {
                                    return (
                                        <tr>
                                            <td>{transaction.paymentMode}</td>
                                            <td>{transaction.transactionType}</td>
                                            <td>${transaction.amount}</td>
                                            <td>{moment(new Date(transaction.createdAt)).fromNow()}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        }
                    </div>
                

                    <div className="userFavGamesContainer">
                        <header>
                            <h2>Liked Games</h2>
                        </header>
                        {player.likedGames.length == 0 ? <div className="userFavGames">
                            <img src={"https://cdn.iconscout.com/icon/premium/png-256-thumb/no-data-found-1965030-1662565.png"}></img>
                            <p>Oops there is no data yet</p>
                        </div> : 
                        <div>
                            {player.likedGames.map((likedGame) => {
                                return (
                                <div className="userFavGame">
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <img src={gorilla}></img>
                                        <h3 style={{marginLeft: "5px"}}>{likedGame.name}</h3>
                                    </div>
                                </div>
                                )
                            })}
                        </div>}
                    </div>

                    <div className="userRecentGamesContainer">
                        <header>
                            <h3>History</h3>
                        </header>
                        {player.history.length == 0 ? <div className="userRecentGames">
                                <img src={"https://cdn.iconscout.com/icon/premium/png-256-thumb/no-data-found-1965030-1662565.png"}></img>
                                <p>Oops there is no data yet</p>
                            </div> : 
                            <div>
                                {player.history.map((game) => {
                                    return (
                                        <div className="userFavGame">
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <img src={gorilla}></img>
                                                <h3 style={{marginLeft: "5px"}}>{game.name}</h3>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                    </div>

                </div>
            </div> : ""}
        </>
    )
}
