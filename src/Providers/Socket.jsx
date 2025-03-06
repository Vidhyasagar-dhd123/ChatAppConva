import React, {useMemo} from "react"
import openSocket from "socket.io-client"

const SocketContext = React.createContext(null)

export const useSocket = () =>{
    return React.useContext(SocketContext)
}

export const SocketProvider = (props)=>{
    const socket = useMemo(()=>openSocket("/"),[])
    return (
        <SocketContext.Provider value={({socket})}>
            {props.children}
        </SocketContext.Provider>
    )
}