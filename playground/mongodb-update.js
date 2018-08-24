


//Update

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

    //https://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndUpdate
    //***findOneAndUpdate(filter, update, options, callback)->Promise
    // db.collection('Todos').findOneAndUpdate({
    //     //filter with ID
    //     _id: new ObjectID('5b7e73b74ceafcc5d898fa2c') //completed: false
    //     },{
    //     //update operator
    //     //https://docs.mongodb.com/manual/reference/operator/update/
    //     //$set	Sets the value of a field in a document.
    //     $set: { 
    //         completed: true //change false to true
    //         }
    //     }, {
    //     //callback
    //     returnOriginal: false  //When false, returns the updated document rather than the original. The default is true.
    //     }).then((result)=>[
    //         console.log(result)
    //     ])

    //======exercise
    db.collection('Users').findOneAndUpdate({
        //filter with ID
        _id:123  //**see in Robo 3T if it's ObjectID or just id */
        },{ 
        //update operator
        //https://docs.mongodb.com/manual/reference/operator/update/
        //$set	Sets the value of a field in a document.
            $set: { 
                name:'Tom' //change false to true
            },
            $inc: {
            age: -1 //decrease by 1
            }
        }, {
        //callback
        returnOriginal: false  //When false, returns the updated document; When True, returns the orginal document
        }).then((result)=>[
            console.log(result)
        ])
}); 