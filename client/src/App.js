import './App.css';
import Navbar from './components/navbar/Navbar';
import Home from './pages/home/Home';
import Game from './pages/game/Game';
import Settings from './pages/settingsPage/Settings';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext"
import Login from './pages/login/Login';
import { refresh } from './apiCalls';
import Image from './pages/imagesPage/Image';

function App() {

    const { user, dispatch } = useContext(AuthContext)

    useEffect(() => {
      const refreshToken = localStorage.getItem("refreshToken")
      refresh({accessToken: null, refreshToken: refreshToken}, dispatch)
  }, [])

    return (
      <>
          <Router>
              <Routes>
                    <Route exact path="/" element={user ? <Home /> : <Navigate to="/login"/>}></Route>
                    <Route path='/login' element={user ?  <Navigate to="/" /> : <Login />}></Route>
                    <Route path="/game" element={user ? <Game /> :  <Navigate to="/login"/>}></Route>
                    <Route path="/settings" element={user ? <Settings /> :  <Navigate to="/login" />}></Route>
                    <Route path="/images" element={<Image />}></Route>
              </Routes>
          </Router>
      </>
  );
}

export default App;
