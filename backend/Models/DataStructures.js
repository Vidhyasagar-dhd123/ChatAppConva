/*
The information required during current session chat!
*/
const Users = new Array()
function User(name, id,){
    this.name = name;
    this.id = id;
}

function Message(id,name,message,type){
    this.id = id
    this.name = name
    this.message = message
    this.type = type
}


module.exports ={Users, User, Message}