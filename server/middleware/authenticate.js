
//Code used to lived in server.js, but we moved it here

var {Users} = require('./../models/user')


//Private route and Auth middleware
var authenticate = (req,res,next)=>{
    var token = req.header('x-auth');

    //find user with related token
    Users.findByToken(token).then((user)=>{
        if(!user){
            // res.status(401).send() , below Promise.reject() will do the same
            return Promise.reject()
        }
        req.user= user;
        req.token = token;
        next();
    }).catch((e)=>{
        res.status(401).send();//status 401 and send empty body
    });
};

module.exports = {authenticate}