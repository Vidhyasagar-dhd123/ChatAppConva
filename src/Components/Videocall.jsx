import React, { useCallback, useEffect, useRef, useState } from "react";
import ControlVideo from "./ControlVideo";
import { usePeer } from "../Providers/peer";
import { useSocket } from "../Providers/Socket";
function Videocall() {
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
  } = usePeer();
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
    const [remoteStream,setRemoteStream] = useState(null)
  const [stream, setStream] = useState(null);
  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);
  const { socket } = useSocket();

  const setVideoAudio = (video, audio) => {
    setVideo(video);
    setAudio(audio);
  };
  //From first User
  const handleOffer = useCallback(
    async ({ offer, name }) => {
      if (name !== socket.name) {
        const ans = await createAnswer(offer);
        console.log(offer);
        socket.emit("answer", { ans, name: socket.name });
      }
    },
    [socket, createAnswer]
  );

  const handleAnswer = useCallback(
    async ({ ans, name }) => {
      if (name !== socket.name) {
        await setRemoteAns(ans);
        console.log(ans);
      }
    },
    [setRemoteAns]
  );

  const startCall = async () => {
    const userStream = await navigator.mediaDevices.getUserMedia({
      video,
      audio,
    });
    localVideoRef.current.srcObject = userStream;
    setStream(userStream);
    sendStream(userStream);
   
    const offer = await createOffer()
    socket.emit("offer", {offer,name:socket.name})
  };
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleTracks = (event) => {
    console.log(event);
    setRemoteStream(event.streams[0]);
  };

  const handleCandidate=(event)=>{
    if(event.candidate!==null){
    socket.emit("candidate",{candidate:event.candidate,name:socket.name })
    console.log(event)}
  }

const setCandidate=async({candidate,name})=>{
  if(name!==socket.name)
  await peer.addIceCandidate(candidate);
}

  useEffect(() => {
    peer.addEventListener("track",handleTracks)
    peer.addEventListener("icecandidate",handleCandidate)
    socket.on("candidate",setCandidate)
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);

    startCall();

    return () => {
      socket.off("offer", handleOffer);
      socket.off("candidate", setCandidate);
      socket.off("answer", handleAnswer);
      peer.removeEventListener("track",handleTracks)
    };
  }, [video, audio]);

  return (
    <div className="videoContainer">
      <div className="left-video">
        <video
          style={{ maxWidth: "100%" }}
          ref={localVideoRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <div className="right-video">
        <video
          style={{ maxWidth: "100%" }}
          ref={remoteVideoRef}
          autoPlay
          playsInline
        ></video>
      </div>
      <ControlVideo
        setValues={setVideoAudio}
        values={{ video, audio }}
      ></ControlVideo>

    </div>
  );
}

export default Videocall;
