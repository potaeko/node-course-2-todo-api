//npm i mongoose --save
//We require mongoose
var mongoose = require('mongoose');

//mongo support promise
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp'); //***connect to TodoApp ***
//mongodb take a callback to get in the database

//Create Model
//In mongoose we have to create model to store data collection called 'Todo'
var Todo = mongoose.model('Todo',{  //.model take string, Object
    text: {
        type: String,
        //set default https://mongoosejs.com/docs/validation.html
        required: true, //if add data without text, will get error
        minlength: 1,  //min character
        trim: true //delete all the space front and behind
    },
    completed: {
        type: Boolean,
        default: false //set default to false
    },
    completedAt:{
        type: Number,
        default: null //set default to null
    }
});

//construture data to add  to Todo collection
var newTodo = new Todo({
    text:' Edit this video'
});

//To save to database and return promise
newTodo.save().then((doc) => {
    console.log('Saved todo', doc)
},(e)=>{
    console.log('Unable to save todo',e);    
 });

 //===========================
//exercise
//Add data to Todo collection
var newTodo = new Todo({
    text: 'Get a job',
    completed: false,
    completedAt: 0
});
newTodo.save().then((doc) => {
    console.log('saved suceesful!',doc)
},(e)=>{
    console.log('Unable to save',e);  
});

//===================================================
//==exercise create new collection Users and add data
var Users = mongoose.model('Users',{
    User:{
        type :String,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

var newUser = new Users({
    User: 'Tom Kosit',
    email: 'tom@gmail.com  '
});

newUser.save().then((doc)=>{
    console.log('Successful save newUser!', doc)
    },(e)=>{
    console.log('Unable to save newUser',e)
});

//======***** MOVE ALL TO SEPERATE FILE and install express and body-parser