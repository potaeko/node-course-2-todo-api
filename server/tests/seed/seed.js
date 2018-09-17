
const {ObjectID} = require('mongodb');

const {Todo} = require('./../../models/todo');

const {Users} = require('./../../models/user')

const jwt = require('jsonwebtoken')

const userOneId = new ObjectID()
const userTwoId = new ObjectID()

//seed data
const users = [{
    _id: userOneId,
    email: 'tom@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token:  jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString() //*** abc123 need to be the same in user.js, we moved secret code to config.json 
    }]
},{
    _id: userTwoId,
    email: 'teera@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token:  jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString() //*** abc123 need to be the same in user.js 
    }]
}]

//***To Test GET /todos
const todos = [{
    _id : new ObjectID(),
    text : 'First test todo',
    _creator: userOneId
}, {
    _id : new ObjectID(),
    text : 'Second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}]; 

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        //insertMany method from mongoose method with const todos
        return Todo.insertMany(todos);
    }).then(()=>done());
};

const populateUsers = (done) =>{
    Users.remove({}).then(()=>{ //wipe all the data and add the record
        var userOne = new Users(users[0]).save();
        var userTwo = new Users(users[1]).save();
        
        return Promise.all([userOne,userTwo])
    }).then(()=>done());
}

module.exports = {todos, populateTodos, users, populateUsers}