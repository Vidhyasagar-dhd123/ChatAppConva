import React, { useEffect, useState } from "react";
import '../styles/Inbox.css'
const Inbox = ({socket, message})=>{
    const [loadedmsgs, refreshMsg] = useState([]);
    useEffect(()=>{
        refreshMsg(message)
    },[message])
    console.log(loadedmsgs)
    function arrayBufferToBase64(buffer) 
    { let binary = ''; 
      const bytes = new Uint8Array(buffer); 
      const len = bytes.byteLength; 
      for (let i = 0; i < len; i++) {
         binary += String.fromCharCode(bytes[i]); 
        } 
        return window.btoa(binary); 
      }
    const returnImage=(data)=>{
      const base64 = arrayBufferToBase64(data)
      const dataURL = `data:image/jpg;base64,${base64}`
      console.log("This is working",dataURL)
      return <img width="200px" alt="Not Found"  src={dataURL}/>
    }
    if(loadedmsgs)
    return(<div className="inbox-container">
        <div className="chatPlate">
        {
          
            loadedmsgs.map((osmg, index) => {
              if (loadedmsgs) {
                return (
                 
                  <div
                    key={index}
                    className={
                      osmg.name === socket.name? "usermessage" : "extMessage"
                    }
                  > {osmg.type==="text"?
                    <p className="msg">{osmg.message}</p>:returnImage(osmg.message)}
                    <p className="name">
                      {osmg.time} | {osmg.name}
                    </p>
                  </div>
                );
              }
              return null;
            })
          }

        </div></div>
    )
    else return <div>No Messages</div>
}

export default Inbox