
//======***** MOVE ALL TO SEPERATE FILE and install express and body-parser

var express = require('express');
var bodyParser = require('body-parser'); //take JSON and convert to object

var {ObjectID} = require('mongodb')
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {Users} =require('./models/user');

var app = express();
//Deploy to Heroku, if the port is defined, if not we use local 3000
const port = process.env.PORT || 3000;

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

//const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Started on port ${port}`);
});

//GET /todos/1234567 , fetch id parameter
app.get('/todos/:id',(req,res)=>{
    //**get id from **params** ,caution params not param*
    var id = req.params.id;
    // res.send(req.params); //To test in Postman

    //Valid id using isValid
    if(!ObjectID.isValid(id)){
        //404 - send back empty send
        return res.status(404).send()
    }
    //findById
    Todo.findById(id).then((todo)=>{
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
        

module.exports = {app};