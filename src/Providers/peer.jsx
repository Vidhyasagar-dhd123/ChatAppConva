import React,{useMemo,useEffect, useState} from "react"

const PeerContext = React.createContext(null)
export const usePeer = () => {
    const peerContext = React.useContext(PeerContext);
    if (!peerContext) {
        throw new Error("usePeer must be used within a PeerProvider");
    }
    return peerContext;
};

export const PeerProvider = (props)=>{
    const peer = useMemo(()=>{
        return new RTCPeerConnection({
            iceServers:[
                {
                    urls:[
                        "stun:stun.l.google.com:19302"
                    ],
                },
            ],
        })
    },[])
    const createOffer = async()=>{
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer)
        return offer;
    }
    const createAnswer = async(offer)=>{
        await peer.setRemoteDescription(offer)
        const answer = await peer.createAnswer(offer)
        await peer.setLocalDescription(answer)
        return answer
    }
    const sendStream = async (userStream) => {
        console.log("Adding tracks to peer connection:", userStream.getTracks());
        userStream.getTracks().forEach((track) => {
            peer.addTrack(track, userStream);
            console.log("Track added:", track);
        });
    };
    
    const setRemoteAns=async(ans)=>{
        await peer.setRemoteDescription(ans)
    }
    return <PeerContext.Provider value={{peer, createOffer, createAnswer,setRemoteAns,sendStream}}>
        {props.children}
    </PeerContext.Provider>
}