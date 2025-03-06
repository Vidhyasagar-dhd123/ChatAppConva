import React from "react";
import "../styles/RoomTable.css";

function RoomTable({ socket, sendRooms, myfunction,action }) {
  const renderRoomBody = () => {
    return sendRooms?.map((room, id) => (
      <tr key={id}>
        <td>{id + 1}</td>
        <td>{room.genreName}</td>
        <td>{room.content}</td>
        <td>{room.roomId}</td>
        <td>{room.roomPass}</td>
        <td>
          {action==="Join Room"?
          <button
            className="join-button"
            onClick={()=>{
              socket.emit("joinRoom",room)
              socket.type = room.type
            }}
          >
            {action}
          </button>: <button
            className="join-button"
            onClick={myfunction.bind(this,id)}
          >
            {action}
          </button>}
        </td>
      </tr>
    ));
  };

  return (
    <div className="room-table-container">
      <table className="room-table">
        <thead>
          <tr>
            <th>Index</th>
            <th>Genre</th>
            <th>Name</th>
            <th>Id</th>
            <th>Pass</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sendRooms?.length > 0 ? (
            renderRoomBody()
          ) : (
            <tr>
              <td colSpan="6">No rooms available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RoomTable;
