import React, { useState } from "react";
import "../styles/MessageBox.css";


const MessageBox = ({socket,sendData}) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim()) {
      sendData(message,"text")
      setMessage(""); // Clear the input after sending
    }
  };
  const handleFile=()=>{
    const file = document.createElement('input')
    file.type = 'file'
    file.accept ='image/*'
    file.onchange=(e)=>{
      const data = e.target.files[0]
      if(data){
        const reader = new FileReader()
        reader.readAsArrayBuffer(data)
        reader.onload=()=>{
          const bufferData = reader.result
          sendData(bufferData,"image")
        }
        reader.onerror=()=>{
          console.log("An error occured")
        }
    }
    }
    file.click()
  }

  return (
    <div className="message-box-container">
      <div className="message-box">

      <button style={{border:"none"}} onClick={handleFile}> <i style={{fontSize:"2rem"}} className="fas fa-paperclip"></i> </button>
        <input
          type="text"
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button className="send-btn" onClick={handleSendMessage}>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default MessageBox;
