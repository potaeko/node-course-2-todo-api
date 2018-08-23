
//MongoDB module V3

//const MongoClient = require('mongodb').MongoClient;.
//ES6 destructuring
const {MongoClient, ObjectID} = require('mongodb');

//take two arguement (string, callback function)
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err, client)=>{
    if(err){
       return console.log('Unable to connect to MongoDB server') //return will quit here or we can use else instead of else
    }
    console.log('connected to MongoDB server');
    //create TodoApp database
    const db = client.db('TodoApp')
    //collection take name arguement, insertOne insert one object to server and callback function
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // },(err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert todo',err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    //====exercise create Users collection
    // db.collection('Users').insertOne({
    //     //we can ad  our own id
    //     //_id: 123,
    //     name:'Tom',
    //     age: 31,
    //     location: 'San Francisco'
    // },(err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert User', err);
    //     }
    //     console.log(result.ops[0]._id.getTimestamp());
    // })
    //close method 
    client.close();
}); 


//=====object destructuring example===
// var user ={name: 'Tom', age:31 };
// var {name} = user;
// console.log(name) // Tom

//=====create ID from ObjectId method of Mongo
// var obj = new ObjectID();
// console.log(obj)
