import React from "react";
import { AuthPage } from "../Containers";
import LoginSignup from "./LoginSignup";
import myImage from '../media/chatbg.jpg'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Home.css'
function Home({auth}) {
    return(<>
    <h1 className="text-bg-danger">Welcome to Our Chat App</h1>
    <div className="tag text-bg-success fw-light">Hey, How are you there!</div>
    </>)
}

export default Home;
