const mongoose = require('mongoose')
// The user login and registration schema
const userSchema = new mongoose.Schema(
    {
        name:{type:"string", required:true},
        username:{type:"string",required:true},
        email:{type:"string",reuired:true},
        password:{type:"string",required:true},
        token:{type:"string",default:null},
        rooms:{type:"number",default:null},
        isBanned:{type:"number",default:1}
    },{timestamps:true}
)

module.exports = mongoose.model('DBUser',userSchema)