
//======***** MOVE ALL TO SEPERATE FILE and install express and body-parser

var express = require('express');
var bodyParser = require('body-parser'); //take JSON and convert to object

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} =require('./models/User');

var app = express();

//apply bodyParser to Express
app.use(bodyParser.json());

// post todos route
//express to access: created route /todos to add data
app.post('/todos',(req,res)=>{
    //console.log(req.body) to see what we get from Postman when we post JSON

    //save the request data to mongodb
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc)=>{
        res.send(doc); //code 200 for success received data
    },(e)=>{
        res.status(400).send(e);
    })
});

//get todos route
app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos}) //handle success
    },(e)=>{              //handle error
        res.status(400).send(e);
    })
})

app.listen(3000, ()=>{
    console.log('Started on port 3000');
});


module.exports = {app};