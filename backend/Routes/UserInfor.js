const cookie = require('cookie')
const {Genres, DBUser } = require("../Models");
const router = require("express").Router();
const { routeAuth} = require("../Middlewares/Authenticate");
router.get("/myRooms",routeAuth,async (req,res)=>{
    try{
    const rooms = await Genres.find({creator:req.username})
    return res.json(rooms)
  }
    catch(err){
      return res.end(req.body)
    }
  })

router.delete("/myRooms/:id",routeAuth,async(req,res)=>{
  const cookiesHeader = req.headers.cookie
  const id = req.params.id
  const cookies = cookie.parse(cookiesHeader)
  const token = cookies.token
  const username = cookies.username
  try{
    const room = await Genres.findOne({creator:username}).skip(id).limit(1)
    if(!room)
      res.end("No Rooms Available")
    const dbtoken = await DBUser.findOne({username})
    if(username === room.creator && dbtoken.token === token){
      const del = await Genres.deleteOne({_id:room.id,creator:username})
    }else{
      console.log("token",token,"\ndbtoken", dbtoken.token, "\nusername", username, "\ncreator",room.creator)
    }
  }catch(err){
    console.log('An Error occurred in UserInfor.js Line no. 21', err,id)
  }
  res.end("myRooms");
})
 
module.exports = router;
