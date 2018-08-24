


//Delete

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

    // deleteMany , delete all match
    // db.collection('Todos').deleteMany({text:'Eat lunch'}).then((result)=>{
    //     console.log(result)
    // })

    //deleteOne , delete first one, result the result with ok and n, just to see how many we deleted
    // db.collection('Todos').deleteOne({text:'Eat lunch'}).then((result)=>{
    //     console.log(result)
    // })

    // findOneAndDelete, return the result with document that we deleted
    // db.collection('Todos').findOneAndDelete({completed:false}).then((result)=>{
    //     console.log(result)
    // })

    // ===exercise deleteMany
    // db.collection('Users').deleteMany({name: 'Tom'}).then((result)=>{
    //     console.log(result)
    // })

    //exercsie findOneAndDelete by _id
    db.collection('Users').findOneAndDelete({_id: new ObjectID('5b7d1caa9c1c5132e6de639a')}).then((result)=>{
        console.log(result)
    })

}); 