//Environmental imports
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const PORT = process.env.PORT||3300;
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const cors = require('cors')

//Plugins
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;



//Local libraries
const { routeAuth, socketAuth } = require("./Middlewares/Authenticate");
const { dbRoute, room, userInfor } = require("./Routes");
const { DBUser, DataStructures, Genres } = require("./Models");
const { getVisitors, doesAlreadyExists } = require("./Controllers");
const { isGenuine } = require("./Intelligence");
const { Users, User, Message } = DataStructures;
const Inbox = {};

// Initialize middleware
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/roomChat", room);
app.use("/api", dbRoute);
app.use("/api",userInfor)
app.use(cors())

const validgenres = (genre)=>{
let genres = ["Math", "Physics", "Biology", "Social Sciences", "Other"];
for(let i in genres){
  if(genres[i]===genre)
    return true
}
return false
}

//Connecting to the database
mongoose
  .connect("mongodb://localhost:27017/vidhyasagar", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log(err));


//sharing static files to the browser
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


//Setting Route authorization for testing
app.get("/protected", routeAuth, (req, res) => {
  try {
    return res.json({ message: "Welcome to chat" });
  } catch (err) {
    return res.json({ redirect: "/" });
  }
});
//emitting visitors to all users
const emitVisitors = (io,con) => {
  con.emit("visitors", getVisitors(io));
};

Inbox["openChat"] = [];
const sessionInbox = Inbox["openChat"];

io.use(socketAuth);

io.on("connection", async (socket) => {
  try {
    const user = await DBUser.findOne({ username: socket.username });
    console.log("User connected:", user.username);
    //Authenticate user after a minute
    const interval = setInterval(async () => {
      try {
        const user = await DBUser.findOne({ username: socket.username });
        if (!user) throw new Error("User not found");
        jwt.verify(user.token, SECRET_KEY);
        console.log("Token valid for user:", user.username);
      } catch (err) {
        console.error("Token validation failed:", err.message);
        socket.emit("unauthorized", { message: "Token expired or invalid." });
        clearInterval(interval);
        socket.disconnect();
      }
    }, 60000);


    socket.emit("setUser", user.username);
    socket.on("new_visitor", (visitor) => {
      doesAlreadyExists(io, socket);
      visitor.name = user.username;
      socket.user = visitor;
      emitVisitors(io.sockets,io);
      socket.emit("setUser", user.username);
    });
    

    socket.on("getRooms", async ({ genre }) => {
      const room = await Genres.find({ genreName: genre });
      if (room) {
        socket.emit("setRooms", room);
        console.log("rooms sent")
      } else {
        socket.emit("alert", "Room not found");
      }
    });

    socket.on(
      "createRoom",
      async (data) => {
         console.log(data)
         const { content, genre, roomId, roomPass, duration,type } =data
        if (!(content && genre && roomId && roomPass && duration && type)) {
          socket.emit("alert", "Enter the values");
        }
        if(validgenres(genre))
        try {
          const existingRoom = await Genres.findOne({ roomId });
          if (existingRoom) {
            socket.emit("alert", "Room already exists");
            return;
}
          const room = new Genres({
            roomId,
            content,
            genreName: genre,
            roomPass,
            duration,
            creator:user.username,
            type
          });
          await room.save();
          Inbox[roomId] = [];
          socket.emit("alert", "Room created");
        } catch (err) {
          socket.emit("alert", "Ambiguity Occured");
          console.log(err);
        }
        else{
          socket.emit("alert","Please select a valid genre")
        }
      }
    );
    socket.on("joinRoom", async (data) => {
      let roomId 
      if(data)
        roomId = data.roomId
      const room = await Genres.findOne({roomId:roomId})
      if(room){
      for (const key of socket.rooms.values()) {
        socket.leave(key);
      }
      socket.roomId = roomId
      socket.join(roomId);
      socket.emit("roomJoined", { roomId });
      if (Inbox[roomId]) socket.emit("updateInbox", Inbox[roomId]);
      socket.broadcast.to(roomId).emit("alert", user.username + " Joined Room");
      console.log(`User ${socket.id} joined room: ${roomId}`);
      emitVisitors(io.to(roomId).adapter.nsp,io.to(roomId))
    }
      else{
        socket.emit("alert","Room Does not exist")
      }
    });


    socket.on("roomMessage", (message, type) => {
      try {
        if (!Inbox[socket.roomId]) Inbox[socket.roomId] = [];
        const roomInbox = Inbox[socket.roomId];
        if (roomInbox.length > 10) roomInbox.shift();
        if (type === "text") message = isGenuine(message);
        roomInbox.push(new Message(socket.id, user.username, message, type));
        io.to(socket.roomId).emit("updateInbox", roomInbox);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("offer", ({offer,name}) => {
      socket.to(socket.roomId).emit("offer", {offer,name});
      console.log(offer,socket.roomId)
    });
  
    socket.on("answer", ({ans,name}) => {
      socket.to(socket.roomId).emit("answer", {ans,name});
      console.log({ans,name})
    });
  
    socket.on("candidate", (data) => {
      socket.to(socket.roomId).emit("candidate", data);
      console.log(data)
    });

    socket.on("leaveRoom", (roomId) => {
      socket.leave(roomId);
      io.to(roomId).emit("alert", `${user.username} left the room`);
    });

    socket.on("disconnect", () => {
      console.log(`${user.username} disconnected`);
      emitVisitors(io.sockets,io);
      clearInterval(interval);
    });
  } catch (err) {
    console.error("Socket error:", err.message);
  }
});

http.listen(PORT, () => {
  console.log("Listening on port:", PORT);
});
