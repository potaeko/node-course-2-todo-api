
//Delete

const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

// .remove({}) will delete all data but we don't get the information back, only how many has been deleted
Todo.remove({}).then((result)=>{
    console.log(result)
});

// .findOneAndRemove() will delete the data, we'll get the deleted object back
Todo.findOneAndRemove({_id: '5b84f5994ceafcc5d89922c2'}).then((todo)=>{
    console.log(todo)
});

//  findByIdAndRemove() will delete by id, we'll get the deleted object back
Todo.findByIdAndRemove('5b84f5994ceafcc5d89922c2').then((todo)=>{
    console.log(todo)
});