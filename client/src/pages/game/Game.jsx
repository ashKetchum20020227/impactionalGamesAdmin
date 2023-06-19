
import "./game.css"
import gorilla from "../../Assets/gorilla.png"
import Navbar from "../../components/navbar/Navbar"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { addGameCall } from "../../apiCalls"
import TournamentPopup from "../../components/tournamentPopup/TournamentPopup"
import Sidebar from "../../components/sidebar/Sidebar"
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';


export default function Game() {

    const [allGames, setAllGames] = useState([])
    const [tournamentPopupTrigger, setTournamentPopupTrigger] = useState(0);
    const [game, setGame] = useState(null)
    
    const gameName = useRef()
    const gameAbout = useRef()
    const gameOwner = useRef()
    const gameRelease = useRef()
    const gameIframeLink = useRef()
    const [file, setFile] = useState(null)

    const handleAddGame = async (e) => {
        e.preventDefault()
        // console.log(file)
        const res = await addGameCall({file: file, name: gameName.current.value, about: gameAbout.current.value, release: gameRelease.current.value, iframeLink: gameIframeLink.current.value, owner: gameOwner.current.value})
        if (res.includes("Success")) {
            gameName.current.value = ""
            gameAbout.current.value = ""
            gameRelease.current.value = ""
            gameIframeLink.current.value = ""
            gameOwner.current.value = ""
        }
    }

    const handleGameSelect = (game) => {
        setGame(game)
        setTournamentPopupTrigger(1)
    }

    const handleGameDelete = async (gameId) => {
        const res = await axios.post("/api/games/delete", {gameId: gameId})

        setAllGames(res.data)
    }

    useEffect(() => {
        const getGames = async () => {
            const res = await axios.post("/api/games/getAllGames")
            // console.log(res.data)
            setAllGames(res.data)
        }

        getGames()
    }, [])

    return (
        <>
            {tournamentPopupTrigger == 1 ? <TournamentPopup game={game} setTournamentPopupTrigger={setTournamentPopupTrigger}/> : ""}
            <Navbar />
            <div className="gameWrapper">
                <div className="gameSidebarContainer"><Sidebar /></div>
                <div className="gameMainContainer">
                    <div className="mostPlayed">
                        <h1>Most Played Games</h1>
                        <div className="mostPlayedGamesContainer">
                            <div className="game">
                                <img src={gorilla}></img>
                                <h3>Rummy</h3>
                                <h3>Play Count: 123</h3>
                            </div>
                            <div className="game">
                                <img src={gorilla}></img>
                                <h3>Ludo Tournament</h3>
                                <h3>Play Count: 213</h3>
                            </div>
                            <div className="game">
                                <img src={gorilla}></img>
                                <h3>Free Cell</h3>
                                <h3>Play Count: 111</h3>
                            </div>
                        </div>
                    </div>

                    <div className="allLiveGames">
                        <h1>All Live Games</h1>
                        {allGames.length != 0 ? <div className="mostPlayedGamesContainer">
                            {allGames.map((game) => {
                                return (
                                    <div className="game">
                                        <img onClick={() => {handleGameSelect(game)}} src={game.icon ? game.icon : gorilla}></img>
                                        <h3 onClick={() => {handleGameSelect(game)}}>{game.name}</h3>
                                        <button onClick={() => {handleGameDelete(game._id)}} className="gameDeleteButton"><DeleteRoundedIcon />Delete</button>
                                    </div>
                                )
                            })}
                        </div> : <h1>No data found</h1>}
                    </div>

                    <div className="addNewGame">
                        <h1>Add a new game</h1>
                        <form onSubmit={(e) => {handleAddGame(e)}}>
                            <div className="formInput">
                                <label for="gameName">Game Name</label>
                                <input ref={gameName} id="gameName" type="text" required></input>
                            </div>
                            <div className="formInput">
                                <label for="gameAbout">Game About</label>
                                <input ref={gameAbout} id="gameAbout" type="text" required></input>
                            </div>
                            <div className="formInput">
                                <label for="gameOwner">Game Owner</label>
                                <input ref={gameOwner} id="gameOwner" type="text"></input>
                            </div>
                            <div className="formInput">
                                <label for="gameRelease">Release Date</label>
                                <input ref={gameRelease} id="gameRelease" type="text"></input>
                            </div>
                            <div className="formInput">
                                <label for="gameIframeLink">Game Iframe Link</label>
                                <input ref={gameIframeLink} id="gameIframeLink" type="text" required></input>
                            </div>

                            <div className="uploadImageDiv">
                                <label for="image">Game Icon</label>
                                <input type="file" id="image" name="image" required onChange={(e) => {setFile(e.target.files[0]); console.log(e)}} />
                            </div>

                            <button type="submit">Add</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
