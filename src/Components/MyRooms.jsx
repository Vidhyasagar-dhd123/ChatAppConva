
import {RoomTable} from './'
import axios from "axios";
const { useEffect, useState } = require("react");
function MyRooms(){
    
    const [rooms, setRooms] = useState(null)
    const deleteRoom=(id)=>{
        try{
            console.log(id)
        axios.delete(`/api/myRooms/${id}`).then(response=>{
            console.log(response)})
        }catch(err){
            console.log('error in MyRooms')
        }
    }
    useEffect(()=>{
        axios.get('/api/myRooms')
        .then(response => {
            setRooms(response.data)
        })
        .catch(error => console.error(error));
    })
return(
    <>
    <RoomTable sendRooms={rooms} myfunction={deleteRoom} action={"delete"}/>
    </>
)
}

export default MyRooms