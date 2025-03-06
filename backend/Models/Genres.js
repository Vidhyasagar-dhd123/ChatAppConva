const mongoose = require('mongoose')
//The schema defining the rooms to be created
const genreSchema = new mongoose.Schema(
    {
        genreName:{type:"string",required:true},
        content:{type:"string",required:true},
        duration:{type:"string",required:true},
        roomId:{type:"string",required:true},
        roomPass:{type:"string",required:true},
        type:{type:"string",required:true},
        creator:{type:"string",required:true}
},{timestamps:true}
)

module.exports = mongoose.model('Genre', genreSchema)