import React, { useRef } from "react";

function CreateRoom({ socket }) {
  const roomId = useRef();
  const genre = useRef();
  const roomName = useRef();
  const duration = useRef();
  const roomPass = useRef();
  const type = useRef() // 

  const handleJoinRoom = () => {
    socket.emit("createRoom", {
      content: roomName.current.value,
      genre: genre.current.value,
      roomId: roomId.current.value,
      roomPass: roomPass.current?.value || "", 
      duration: duration.current.value,
      type: type.current.value
    });
    console.log(roomId.current.value)
  };

  return (
    <div className="form-container">
    <div className="auth-form">
      <div className="form-group">
        <label htmlFor="roomId">Room ID:</label>
        <input
          ref={roomId}
          type="text"
          id="roomId"
          placeholder="Enter your Room ID"
        />
      </div>
      <div className="form-group">
        <label htmlFor="genre">Room Genre:</label>
        <select style={{background:"#434490", outline:"none", border:"none", color:"white"}} ref={genre} id="options">
            <option value="">Enter any genre</option>
            <option value="Math">Mathematics</option>
            <option value="Social Sciences">Social Sciences</option>
            <option value="Biology">Biology</option>
            <option value="Physics">Physics</option>
            <option value="Others">Others</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="roomName">Room Name:</label>
        <input
          ref={roomName}
          type="text"
          id="roomName"
          placeholder="Enter the Room Name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Duration:</label>
        <input
          ref={duration}
          type="time"
          id="duration"
          placeholder="Enter the Room Duration"
        />
      </div>
      <div className="form-group">
        <label htmlFor="genre">Room Type:</label>
        <select style={{background:"#434490", outline:"none", border:"none", color:"white"}} ref={type} id="options">
            <option  value="chat">Enter any genre</option>
            <option value="videocall">Video call</option>
            <option value="chat">chat</option>
        </select>
      </div>
      {/* Optional room password */}
      <div className="form-group">
        <label htmlFor="roomPass">Room Password (Optional):</label>
        <input
          ref={roomPass}
          type="password"
          id="roomPass"
          placeholder="Enter a Room Password"
        />
      </div>
      <button className="form-btn" onClick={handleJoinRoom}>
        Join Room
      </button>
    </div>
    </div>
  );
}

export default CreateRoom;
