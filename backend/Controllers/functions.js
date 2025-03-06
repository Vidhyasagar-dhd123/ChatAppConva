//find the users connected to the socket
const getVisitors = (io) => {
    const clients = io.sockets;
    const users = [];
    clients.forEach((socket) => {
      if (socket.user) {
        users.push(socket.user);
      }
    });
    return users;
  };

//Check the user is trying to connect multiple times
const doesAlreadyExists = (io,socket)=>{
  const clients = io.sockets.sockets;
  if(clients)
  clients.forEach((sc)=>{
    if(sc.user){
      if(sc.user===socket.user)
      {
        sc.disconnect()
      }
    }
  })
}
  module.exports ={getVisitors, doesAlreadyExists}