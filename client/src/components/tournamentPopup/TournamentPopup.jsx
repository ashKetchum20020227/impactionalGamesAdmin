
import "./tournamentpopup.css"
import CloseIcon from '@material-ui/icons/Close';
import gorilla from "../../Assets/gorilla.png"
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from "axios"
import { useEffect, useState, useRef } from "react";
import CircleIcon from '@mui/icons-material/Circle';
import coin from "../../Assets/coin.png"

export default function TournamentPopup(props) {

    const [tournaments, setTournaments] = useState([])

    const minPlayers = useRef()
    const maxPlayers = useRef()
    const entryAmount = useRef()
    const winnerPercentage = useRef()
    const runnerPercentage = useRef()

    const handleAddTournament = async (e) => {
        e.preventDefault()
        const res = await axios.post("/api/tournaments/addTournament", {gameId: props.game._id, minPlayers: minPlayers.current.value, maxPlayers: maxPlayers.current.value, entryAmount: entryAmount.current.value, winnerPercentage: winnerPercentage.current.value, runnerPercentage: runnerPercentage.current.value})
        setTournaments(res.data)
    }

    useEffect(() => {
        const getTournaments = async () => {
            const res = await axios.post("/api/tournaments/getTournaments", {gameId: props.game._id})
            setTournaments(res.data)
        }

        getTournaments()

    }, [])

    return (
        <>
            <div className="tournamentPopupOuter">
                <div className="tournamentPopupInner">
                    <header>
                        <CloseIcon style={{cursor: "pointer", fontSize: "30px", marginRight: "20px"}} onClick={() => props.setTournamentPopupTrigger(0)} />
                    </header>

                    <div className="gameInfoContainer">
                        <div className="gameLikes">
                            <FavoriteIcon style={{color: "tomato", marginRight: "5px"}} />
                            <p>{props.game.likes.length}</p>
                        </div>

                        <div className="gameInfo">
                            <img src={gorilla}></img>
                            <h2>{props.game.name}</h2>
                        </div>
                    </div>
                    
                    <div className="liveTournamentsContainer">
                        <h2>Live Tournaments</h2>
                        {tournaments.length == 0 ? <h3>No tournaments exist for this game</h3> 
                        : 
                        <div className="liveTournaments">
                        {tournaments.map((tournament) => {
                            return (
                                <div className="tournamentContainer">
                                    <p>Min. Players = {tournament.minPlayers}</p>
                                    <p>Max. Players = {tournament.maxPlayers}</p>
                                    <p>Entry Amount = {tournament.entryAmount}</p>
                                    <p>Winning Percentage = {tournament.winnerPercentage}</p>
                                    <p>Runner-up Percentage = {tournament.runnerPercentage}</p>
                                </div>
                            )
                        })}
                        </div>
                        
                        }
                    </div>

                    <div className="addTournamentContainer">
                        <h3>Add a new tournament for {props.game.name}</h3>
                        <form onSubmit={(e) => {handleAddTournament(e)}}>
                            <div>
                                <label htmlFor="minPlayers">Min. Players</label>
                                <input ref={minPlayers} id="minPlayers" type="text"></input>
                            </div>

                            <div>
                                <label htmlFor="maxPlayers">Max. Players</label>
                                <input ref={maxPlayers} id="maxPlayers" type="text"></input>
                            </div>

                            <div>
                                <label htmlFor="entryAmount">Entry Amount</label>
                                <input ref={entryAmount} id="entryAmount" type="text"></input>
                            </div>

                            <div>
                                <label htmlFor="winnerPercentage">Winning Percentage</label>
                                <input ref={winnerPercentage} id="winnerPercentage" type="text"></input>
                            </div>

                            <div>
                                <label htmlFor="runnerPercentage">Runner Percentage</label>
                                <input ref={runnerPercentage} id="runnerPercentage" type="text"></input>
                            </div>
                            <button type="submit">Add</button>
                        </form>
                    </div>
                </div>

                
            </div>
        </>
    )
}
