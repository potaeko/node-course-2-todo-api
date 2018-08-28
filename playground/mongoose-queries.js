
//Query
//Learn more at https://mongoosejs.com/docs/queries.html
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');


//todos collection query
var id= '5b8242ff8a39056beeedc7e2';

if(!ObjectID.isValid(id)){
    console.log('ID not valid')
}

// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// })

Todo.findById(id).then((todo)=>{
    if(!todo){
        return console.log('ID not found')
    }
    console.log('Todo by Id', todo);
}).catch((e)=>console.log(e))



//Users collection query

var userId = '5b7fb0e07f4488516d383d37';
Users.findById(userId).then((user)=>{
    if(!user){
       return console.log('USER ID not found');
    }
    console.log('User by ID', user)
    },(e) =>{
        console.log(e)
    })



