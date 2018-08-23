
//Fetch data .find

//Find
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
   
    //find() to fetch all data
    //toArray() return promise 

    //*****************
    //======find() method, to get only completed:false
    db.collection('Todos').find({completed: false}).toArray().then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
        console.log('******************')
    },(err)=>{
        console.log('Unable to fetch todos', err)
    });


    //******************
    //======ObjectID method, to get id example
    db.collection('Todos').find({
        _id: new ObjectID('5b7d1b6700c61b26fb9c3541')
    }).toArray().then((docs)=>{
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
        console.log('*******************')
    },(err)=>{
        console.log('Unable to fetch todos', err)
    });


    //*****************
    //http://mongodb.github.io/node-mongodb-native/3.1/api/Cursor.html#count
    //======count method, to get how many items we have
    db.collection('Todos').find().count().then((count)=>{
        console.log(`Todos count:${count}`);
    },(err)=>{
        console.log('Unable to fetch todos', err)
    });

    //*****Exercise, get the specific name from Users collection*******
    db.collection('Users').find({name:'Tom'}).toArray().then((docs)=>{
        console.log('Users')
        console.log(JSON.stringify(docs, undefined,2))   
    },(err)=>{
        console.log('Unable to fetch Users', err)
    })


    //close method 
    // client.close();
}); 