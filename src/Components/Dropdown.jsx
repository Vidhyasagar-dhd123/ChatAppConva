import React from 'react'
import "../styles/dropdown.css";

function Dropdown({socket}) {

  const handleChange = (event) => {
    console.log(event.target.value,socket)
    socket.emit('getRooms',{genre:event.target.value})
  };

  return (
    <div className="dropdown-container">
 
    <select
      id="chat-options"
      className="dropdown-select"
      value=""
      onChange={handleChange}
    >       <option>Select Genre</option>
            <option value="Math">Mathematics</option>
            <option value="Social Sciences">Social Sciences</option>
            <option value="Biology">Biology</option>
            <option value="Physics">Physics</option>
            <option value="Others">Others</option>
    </select>

  </div>
  )
}

export default Dropdown