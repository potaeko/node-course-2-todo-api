//****We need to go to pacjakge.json and add scripte to run test */
// "scripts": {
//     "test":"mocha server/**/*.test.js",   //we will run file in server folder with *any file end with.test.js end 
//     "test-watch":"nodemon --exec 'npm test'" //test-watch is nodemon to execute npm test
//   },

const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//access to the files
const {app} = require('./../server');
const {Todo} = require('./../models/todo')

//***To Test GET /todos
const todos = [{
    _id : new ObjectID(),
    text : 'First test todo'
}, {
    _id : new ObjectID(),
    text : 'Second test todo'
}]; 


//**To Test POST /todos We will want to delete all the data in Mongodb before the test 
//because "expect(todos[0].text).toBe(text); " we want to get the first item 
beforeEach((done)=>{
    Todo.deleteMany({}).then(()=>{
        //insertMany method from mongoose method with const todos
        return Todo.insertMany(todos);
    }).then(done());
});

//describe makes Headline To show in Terminal for easier to read the test
describe('Test POST /todos',()=>{    
    it('should create a new todo',(done)=>{ 

        var text = 'Test todo text'; //we will send this text to test
        request(app)    //supertest with app from server.js
        .post('/todos') //post to /todos collection URL
        .send({text}) //send text 
        .expect(200)    //expect to get 200 code, OK
        .expect((res)=>{   //expect to get res.body.text from Express === text we send
            expect(res.body.text).toBe(text);
        })
        .end((err, res)=>{ //we want to see what got store in Mongodb
            if(err){    //handle the error
                return done(err); //printing the error, return will stop the code here, call done for supertest
            }
            Todo.find({text}).then((todos)=>{ //we want to check todos with var text we send
                expect(todos.length).toBe(1);   //should have only 1 item in todos object
                expect(todos[0].text).toBe(text);   //expect text we send only 1 item to be text
                done();// call done for supertest ,done() for asynchronous
            }).catch((e)=>done(e));    //catch will get the error in callback, because if expect fail the test still passed
        })
    })
 
    //send empty object, get 400 code, assumption from database no data in todos
    it('should not create todo with invalid body data', (done)=>{
        request(app)
        .post('/todos') //post data
        .send({}) //send empty object to /todos route
        .expect(400) //expect 400 bad request
        .end((err,res)=>{
            if(err){    //handle the error
                return done(err); //printing the error, return will stop the code here, call done for supertest
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2); //expect two objects in todos that we created as todos
                done(); //done() for asynchronous
        }).catch((e)=>done(e))
        });
    });

//GET /todos Test
describe('GET /todos', () =>{
    it('should get all todos', (done)=>{
        request(app)
        .get('/todos') //get data
        .expect(200) //expect to get 200 code ,ok
        .expect((res)=>{    //res.body.todos.length should be 2
            expect(res.body.todos.length).toBe(2)
            })
            .end(done)
        })
    });

});
//GET /todos/:id
describe('GET /todos/:id', ()=>{
    //Test new ObjectID with data
    it('should return todo doc', (done)=>{
        request(app) //supertest with express
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200) //expect status 200
        .expect((res)=>{ //expect res back with res body match the same text from the first todos[0]
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });
    //Test new ObjectID with no data to get 404
    it('should return 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    });
    //Test route params :id 123
    it('should return 404 for non-object ids',(done)=>{
        request(app)
        .get('/todos/123') //inValid id
        .expect(404)
        .end(done)

    })

});

describe('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        var HexId = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${HexId}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(HexId);
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }
        //query database using findById toNotExist
        //expect(null).toNotExist();
        Todo.findById(HexId).then((todo)=>{
            expect(todo).toBeFalsy() 
            done()
        }).catch((e)=>done(e))
        })
    })

    it('should return 404 if todo not found',(done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
    })

    it('should return 404 if object id is invalid', (done)=>{
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done)
    })
})