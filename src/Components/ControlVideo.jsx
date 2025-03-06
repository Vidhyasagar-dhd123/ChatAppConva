
import "../styles/Videocall.css";
function ControlVideo({setValues,values}) {
  const toggle =(value)=>{
    return (!value)
  }
  const setAudio=()=>{
    setValues(values.video,toggle(values.audio))
    console.log(values)
  }
  
  const setVideo=()=>{
    setValues(toggle(values.video),values.audio)
    console.log(values)
  }
  return (
    <>
    <div className="conrolvideo">
    <i class="fa-solid fa-microphone" onClick={setAudio}></i>
    <i class="fa-solid fa-camera" onClick={setVideo}></i>
    </div>
    </>
  )
}

export default ControlVideo