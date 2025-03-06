import React ,{useEffect, useState
} from "react";
import AboutPage from "./Components/AboutPage";
import { AuthPage, ChatPage } from "./Containers";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {Home,ContactPage, Heading, RoomTable} from './Components'
import LoginSignup from "./Components/LoginSignup";
import MyRooms from "./Components/MyRooms";
import { useSocket } from "./Providers/Socket";

function App() {
const [isAuthed, setAuth]= useState(false)
const {socket} = useSocket()
socket.on("setUser",(user)=>{
  socket.name = user
})
const getAuth = (value)=>{
setAuth(value)
}

const router = createBrowserRouter([
  {
    path: "/",

    element:<div>
      <Heading />
      <Home auth={isAuthed}/>
    </div> 
  },
  {
    path: "/about",
    element:<div>
    <Heading/>
    <AboutPage/>
  </div> 
  },
  {
    path: "/chat",
    element:<div>
    <Heading/>
    <ChatPage/>
  </div> 
  },
  {
    path: "/login",
    element:<div>
    <Heading/>
    <LoginSignup auth ={isAuthed} getAuth={getAuth}/>
  </div>
  },
  {
    path: "/myRooms",
    element:<div>
    <Heading/>
    <MyRooms/>
    
  </div>
  },
]);
  return (
    <div>
        <RouterProvider router = {router}/>
     
    </div>
  );
}

export default App;
