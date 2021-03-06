
//======***** MOVE ALL TO SEPERATE FILE and install express and body-parser
require('./config/config.js')

const _ = require('lodash') 
const express = require('express');
const bodyParser = require('body-parser'); //take JSON and convert to object

const {ObjectID} = require('mongodb')
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {Users} =require('./models/user');
var {authenticate} = require('./middleware/authenticate')

var app = express();
//Deploy to Heroku, if the port is defined, if not we use local 3000
const port = process.env.PORT;

//apply bodyParser to Express
app.use(bodyParser.json());

// post todos route
//express to access: created route /todos to add data
app.post('/todos', authenticate, (req,res)=>{
    //console.log(req.body) to see what we get from Postman when we post JSON

    //save the request data to mongodb
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id //making todo route private
    });

    todo.save().then((doc)=>{
        res.send(doc); //code 200 for success received data
    },(e)=>{
        res.status(400).send(e);
    })
});

//get todos route
app.get('/todos',authenticate,(req,res)=>{
    Todo.find({
        _creator: req.user._id //making todo route private 
    }).then((todos)=>{
        res.send({todos}) //handle success
    },(e)=>{              //handle error
        res.status(400).send(e);
    })
})



//GET /todos/1234567 , fetch id parameter
app.get('/todos/:id', authenticate, (req,res)=>{
    //**get id from **params** ,caution params not param*
    var id = req.params.id;
    // res.send(req.params); //To test in Postman

    //Valid id using isValid
    if(!ObjectID.isValid(id)){
        //404 - send back empty send
        return res.status(404).send()
    }
    //findById
    // Todo.findById(id).then((todo)=>{ ; changed after making a private route
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        //if no todo - send back 404 with empty body
        if(!todo){
            return res.status(404).send();
        } 
        //success - send back todo
        res.send({todo}) //todo:todo
        //error case ,400 - send empty body back   
        }).catch((e)=>{
            res.status(400).send();
        })
    });

//Delete route
app.delete('/todos/:id',authenticate, (req,res)=>{
    //get the id
    var id = req.params.id

    //validate the id -> not valid? return 404
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    //remove todo by id
    // Todo.findByIdAndRemove(id).then((todo)=>{ //removed after making private route
    Todo.findOneAndRemove({ //private route
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{    
        //if no doc, send 404
        if(!todo){
           return  res.status(404).send()
        }
        //success, send deleted object data
        res.send({todo})
        //error, 400 with empty body
    }).catch((e)=>{
        res.status(400).send()
    })
})
        
//Patch, Update todos items
app.patch('/todos/:id',authenticate, (req,res)=>{ //added authenticate middleware for making private route
    var id  = req.params.id;
    //we use pick function from lodash here
    //take object and pull exist property array we want to update
    var body = _.pick(req.body, ['text', 'completed']); //_.pick(where we want to pick, property to pick)

    //validate the id -> not valid? return 404
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    //we use isBoolean function from lodash
    //If body.completed is a Boolean and true
    if(_.isBoolean(body.completed)&& body.completed){
        body.completedAt = new Date().getTime(); //get time stamp
    } else { //If If body.completed is not a Boolean or not true
        //we will set to false and no timestamp
        body.completed = false;
        body.completedAt = null;
    }
    //We will update here   
    // Todo.findByIdAndUpdate(id, {$set:body},{new: true}).then((todo)=>{ //new is to show the update; removed after making private route
    Todo.findOneAndUpdate( 
        {_id: id,
        _creator: req.user._id}, //making private route
        {$set:body},
        {new: true}).then((todo)=>{ 
        //if no data for that id
        if(!todo){
            return res.status(404).send()
        }
        //success
        res.send({todo})
    }).catch((e)=>{ //any error
        res.status(400).send()
    }) 

})

//POST /users  ; we can check if the email is valid or not
app.post('/Users', (req,res)=>{
    //_.pick(object we want to pick, property to pick)
    var body = _.pick(req.body, ['email', 'password']);
    var user = new Users(body);

    user.save().then(()=>{
        //without return , x-auth in header will be undefined
        //we create .generateAuthToken() method in user.js
       return  user.generateAuthToken(); 
        //res.send(user);
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});



//pass in authenticate middleware
app.get('/Users/me', authenticate, (req,res)=>{
    res.send(req.user);
});

// POST /users/login {email, password} 
//when user log in we wwant to match email and compare hashpassword with bcrypt.compare
app.post('/Users/login', (req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);
    //***we create findBycredentials method in user.js
    //Users is the model from user.js
    Users.findByCredentials(body.email, body.password).then((user)=>{
         return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send(user);
         })
        //res.send(user); used to check if it works in Postman
    }).catch((e)=>{
        res.status(400).send()
    });
})

//Delete route, logging out by delete token in tokens array in headers x-auth
app.delete('/users/me/token', authenticate, (req,res)=>{
    req.user.removeToken(req.token).then(()=>{ //instant method .removeToken() in user.js
        res.status(200).send();
    },()=>{
        res.status(400).send();
    })
});

//const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
});

module.exports = {app};