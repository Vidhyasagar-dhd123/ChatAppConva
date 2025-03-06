import React, { useCallback, useEffect, useState } from "react";
import { CreateRoom, RoomTable } from "../Components";
import Inbox from "../Components/Inbox";
import MessageBox from "../Components/MessageBox";
import axios from "axios";
import AlertBox from "../Components/AlertBox";
import Videocall from "../Components/Videocall";
import Dropdown from "../Components/Dropdown";
import "../styles/Home.css";
import { usePeer } from "../Providers/peer";
import { useSocket } from "../Providers/Socket";

function ChatPage() {
  const {socket} = useSocket()
  const {createOffer} = usePeer()
  const [inbox, setInbox] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [alertVisible, setAlertVisibility] = useState(false);
  const [alert, setAlert] = useState(null);
  const [room, setRoom] = useState(null);
  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    //get geolocation of user
    axios.get("http://geoplugin.net/json.gp").then((res) => {
      const {
        geoplugin_request,
        geoplugin_countryCode,
        geoplugin_city,
        geoplugin_region,
        geoplugin_countryName,
      } = res.data;

      const visitor = {
        ip: geoplugin_request,
        contryCode: geoplugin_countryCode,
        city: geoplugin_city,
        state: geoplugin_region,
        country: geoplugin_countryName,
      };
      socket.emit("getUser", "User");
      // Emit the visitor data to the server
      socket.emit("new_visitor", visitor);

      // Listen for updates from the server
      socket.on("visitors", (visitors) => {
        setVisitors(visitors);
      });

      // Clean up the socket connection when the component unmounts
      return () => {
        socket.off("visitors");
      };
    });
  }, [socket]);

  const getRooms=(room)=>{
    setRooms(room)
    console.log(rooms)
  }

  const updateInbox=(inbox) => {
    setInbox(inbox);
  }

  const alertMsg = (msg) => {
    SetAlert(msg);
  }

  const onRoomLeft= (msg) => {
    SetAlert(msg);
    setRoom(null);
  }

  const roomJoined =useCallback( async(room) => {
    setRoom(room);
    const offer = await createOffer()
    socket.emit("offer", {offer,name:socket.name})
  },[createOffer,socket])
  //render the table when visitors are updated
  const renderTableBody = () => {
    return visitors.map((v, index) => (
      <tr key={index}>
        <td>{index}</td>
        <td>{v.name}</td>
        <td>
          <img
            src={`https://flagsapi.com/${v.contryCode}/flat/64.png`}
            alt="none"
            style={{width:"20px"}}
          />
        </td>
        <td>{v.city}</td>
        <td>{v.state}</td>
        <td>{v.country}</td>
      </tr>
    ));
  };

  useEffect(() => {
    let isMounted = true;
    const getData = async () => {
      const response = await fetch("/protected");
      if (response.ok) {
        const data = await response.json();
        if (isMounted) SetAlert(data.message);
      } else {
        const data = await response.json();
        if (data.redirect && isMounted) {
          window.location.href = data.redirect;
        }
      }
    };
    getData();

    socket.on("setRooms",getRooms)
    socket.on("updateInbox", updateInbox);
    socket.on("roomJoined", roomJoined);
    socket.on("roomLeft",onRoomLeft);
    socket.on("alert", alertMsg);

    return () => {
      isMounted = false;
      socket.off("setRooms",getRooms)
      socket.off("updateInbox",updateInbox)
      socket.off("roomJoined", roomJoined);
      socket.off("alert",alertMsg)
      socket.off("roomLeft",onRoomLeft);
    };


    
  }, []);


  const sendData = (msg, type) => {
    if (!room) socket.emit("newMessage", msg, type);
    else {
      socket.emit("roomMessage", msg, type);
      console.log("roomMsg");
    }
  };


  //Make the Alert visible for 2s
  const SetAlert = (message) => {
    setAlert(message);
    setAlertVisibility(true);
    setTimeout(() => {
      setAlertVisibility(false);
      setAlert(null);
    }, 2000);
  };


  return (
    <>
    {/*if the alert is sent by the server*/}
      {alertVisible && <AlertBox message={alert}></AlertBox>}
      


      {/*if the socket is not connected do not show the inbox*/}
      {console.log(socket.type)}
      {socket && socket.type ==="chat"? (<>
        <MessageBox sendData={sendData} socket={socket}></MessageBox>
        <Inbox socket={socket} message={inbox}></Inbox></>
      ) : socket && socket.type==="videocall"?<Videocall socket={socket}/>:null}


      {/*In the footer show all the setting tools*/}
      <div className="Footer">
        <RoomTable socket={socket} sendRooms={rooms}  action={"Join Room"}/>
        <Dropdown socket={socket} />


      {/*Show all the users connected to room*/}
        <div className="visitors-container">
          <h2>Live Visitors</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Flag</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
              </tr>
            </thead>
            <tbody>{renderTableBody()}</tbody>
          </table>
        </div>
      </div>

      <CreateRoom socket={socket} />
      {/* <Videocall socket={socket}/> */}
    </>
  );
}

export default ChatPage;
