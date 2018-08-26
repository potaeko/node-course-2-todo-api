//****We need to go to pacjakge.json and add scripte to run test */
// "scripts": {
//     "test":"mocha server/**/*.test.js",   //we will run file in server folder with *any file end with.test.js end 
//     "test-watch":"nodemon --exec 'npm test'" //test-watch is nodemon to execute npm test
//   },

const expect = require('expect');
const request = require('supertest');

//access to the files
const {app} = require('./../server');
const {Todo} = require('./../models/todo')

//**We will want to delete all the data in Mongodb before the test because "expect(todos[0].text).toBe(text); " we want to get the first item 
beforeEach((done)=>{
    Todo.remove({}).then(()=>done());
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
            Todo.find().then((todos)=>{ //we want to check todos with data we send
                expect(todos.length).toBe(1);   //should have only 1 item in todos object
                expect(todos[0].text).toBe(text);   //the check the text we send only 1 item to be text
                done();// call done for supertest
            }).catch((e)=>done(e));    //catch will get the error in callback, because if expect fail the test still passed
        })
    })
 
    //send empty object, get 400 code, assumption from database no data in todos
    it('should not create todo with invalid body data', (done)=>{
        request(app)
        .post('/todos')
        .send({}) //send empty object to /todos route
        .expect(400) //expect 400 bad request
        .end((err,res)=>{
            if(err){    //handle the error
                return done(err); //printing the error, return will stop the code here, call done for supertest
            }

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(0); //expect empty object in todos
                done();
        }).catch((e)=>done(e))
        });
    });
});
