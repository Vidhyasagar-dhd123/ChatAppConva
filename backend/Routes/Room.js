
const { socketAuth } = require('../Middlewares/Authenticate');
const {Rooms, Room } = require('../Models')
module.exports = (io) => {
    // Namespace for the chat application
    const chatNamespace = io.of("/roomChat");
    io.of('/roomChat').use(socketAuth)
    const messages = {
      welcome: "welcome to group chat",
      usertyping: "is typing",
    };
    chatNamespace.on("connection", (socket) => {
      console.log("connected")
      socket.emit("connection_successful", { message: messages.welcome });
      socket.on("setRoomConnection", (con) => {
        console.log("listening set Room")
        socket.emit('room_joined',"roomJoined")
      });
      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
  };
  