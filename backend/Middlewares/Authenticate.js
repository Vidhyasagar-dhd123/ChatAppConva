const cookie = require('cookie')
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY
const DBUser = require('../Models/User')
const path = require('path')

//Authenticating User If requested Connection
async function socketAuth(socket, next){
    const cookieHeader = socket.handshake.headers.cookie;
    //User will not have cookie until visited and logged from login page
    if (!cookieHeader) {
        return next(new Error('Authentication error: Cookies are missing'));
    }
    try {
        const cookies = cookie.parse(cookieHeader);
        const username = cookies.username; 

        if (!username) {
            return next(new Error('Authentication error: Token is missing'));
            
        }
        //Find the user who corresponds to the information from cookie header
        const user = await DBUser.findOne({username})
        const decoded = jwt.verify(user.token, SECRET_KEY);
        socket.username = username;
        if(user.isBanned!==0)
        await next(); 
    } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
    }
    
}

//Similarly Authenticate user when requested the chat page
async function routeAuth(req,res,next){
    const cookieHeader = req.headers.cookie;
    if(!cookieHeader){
        return next(new Error('Authentiacation failed'))
    }
    try{
        const cookies = cookie.parse(cookieHeader)
        const username = cookies.username
        if(!username){
            return next(new Error('Usernot found'))
        }
        const user = await DBUser.findOne({username})
        if(!user){
            return res.status(401).json({ message: "Unregistered user", redirect: "/" });

        }
        const decoded = await jwt.verify(user.token,SECRET_KEY)
        req.username=username
        next()
    }
    catch(err){
        return res.status(403).json({redirect:"/"});
    }

}
module.exports = {socketAuth,routeAuth}