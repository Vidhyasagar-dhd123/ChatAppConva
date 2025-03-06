import React, { useState } from "react";
import { Heading } from "../Components";
import AlertBox from "../Components/AlertBox";
import Inbox from "../Components/Inbox";
import MessageBox from "../Components/MessageBox";
import LoginSignup from "../Components/LoginSignup";

function AuthPage() {
  return (
    <>
      <AlertBox />
      <Inbox name="raja" message={null}/>
      <MessageBox />
    </>
  );
}

export default AuthPage;
