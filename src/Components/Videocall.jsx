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
  };
  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);


  useEffect(() => {
    peer.ontrack=(event) => {
        console.log(event);
        setRemoteStream(event.streams[0]);
      };
  });


  useEffect(() => {
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);

    startCall();

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
    };
  }, [video, audio, remoteStream]);

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
