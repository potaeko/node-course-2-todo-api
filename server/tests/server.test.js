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
const {Users} = require('./../models/user')

const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

//***Move to seed.js, and import from there*/

//***To Test GET /todos
// const todos = [{
//     _id : new ObjectID(),
//     text : 'First test todo'
// }, {
//     _id : new ObjectID(),
//     text : 'Second test todo',
//     completed: true,
//     completedAt: 333
// }]; 

beforeEach(populateUsers)
//**To Test POST /todos We will want to delete all the data in Mongodb before the test 
//because "expect(todos[0].text).toBe(text); " we want to get the first item 
beforeEach(populateTodos);

//describe makes Headline To show in Terminal for easier to read the test
describe('Test POST /todos',()=>{    
    it('should create a new todo',(done)=>{ 

        var text = 'Test todo text'; //we will send this text to test
        request(app)    //supertest with app from server.js
            .post('/todos') //post to /todos collection URL
            .set('x-auth',users[0].tokens[0].token) // we added authenticate with token in server.js
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
            .set('x-auth',users[0].tokens[0].token) // we added authenticate with token in server.js
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
            .set('x-auth',users[0].tokens[0].token) // we added authenticate with token in server.js
            .expect(200) //expect to get 200 code ,ok
            .expect((res)=>{    //res.body.todos.length should be 2
                expect(res.body.todos.length).toBe(1) // we will get return only 1, since we added the authenticate token
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(200) //expect status 200
            .expect((res)=>{ //expect res back with res body match the same text from the first todos[0]
                expect(res.body.todo.text).toBe(todos[0].text)
             })
            .end(done);
    });

     //Test new ObjectID with other user token
     it('should not return todo doc created by other user', (done)=>{
        request(app) //supertest with express
            .get(`/todos/${todos[1]._id.toHexString()}`) //get todos[1]
            .set('x-auth',users[0].tokens[0].token)//but set users[0] token
            .expect(404) //expect status 404
            .end(done);
    });

    //Test new ObjectID with no data to get 404
    it('should return 404 if todo not found', (done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
    //Test route params :id 123
    it('should return 404 for non-object ids',(done)=>{
        request(app)
            .get('/todos/123') //inValid id
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done)

    })

});
//Test delete route
describe('DELETE /todos/:id', ()=>{
    it('should remove a todo', (done)=>{
        var HexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${HexId}`)
            .set('x-auth', users[1].tokens[0].token)
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

    it('should not remove a todo by other creator', (done)=>{
        var HexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${HexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
        //query database using findById toNotExist
        //expect(null).toNotExist();
        Todo.findById(HexId).then((todo)=>{
            expect(todo).toBeTruthy() 
            done()
            }).catch((e)=>done(e))
        })
    });

    it('should return 404 if todo not found',(done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should return 404 if object id is invalid', (done)=>{
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    })
})

//Test PATCH route
describe('PATCH /todos/:id',()=>{

    it('should updated the todo', (done)=>{
    //grab id of first item
    //update text, setcompleted true
    //200/text is changed, completed is true, completedAt is a number .toBeA
    var HexId = todos[0]._id.toHexString();
    var text = "Updated"
    request(app)
        .patch(`/todos/${HexId}`)
        .set('x-auth', users[0].tokens[0].token)// after setting private route in server.js, set token for private route
        .send({
            text,
            completed: true,
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(true)
            expect(typeof res.body.todo.completedAt).toBe('number') //toBeA is no longer used in latest expect version
        })
        .end(done)
    })

    it('should not updated the todo created by other creator', (done)=>{
        var HexId = todos[0]._id.toHexString();
        var text = "Updated"
        request(app)
            .patch(`/todos/${HexId}`)
            .set('x-auth', users[1].tokens[0].token)// after setting private route in server.js, try to update first todo as second user token
            .send({
                text,
                completed: true,
            })
            .expect(404) //expect 404
            .end(done)
        })

    //when we change completed from 'true' to 'false'
    it('should clear completedAt when todo is not completed', (done)=>{
        //grab id of second todo item 
        //update text, set completed to false
        //200
        //text is changed, completd false, completdAt is null .toBeFalsy
        var HexId = todos[1]._id.toHexString();
        var text = "Updated!!"
    request(app)
        .patch(`/todos/${HexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
            text,
            completed: false,
        })
        
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text)
            expect(res.body.todo.completed).toBe(false)
            expect(res.body.todo.completedAt).toBeFalsy() //toNotExist() is no longer used
        })
        .end(done)
    });
});

describe('GET /users/me', ()=>{
    it('should return user if authenticated', (done)=>{
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token) //provide the token
            .expect(200)
            .expect((res)=>{
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
             })
            .end(done);
        });

    it('should return 401 if not authenticated',(done)=>{
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({})
            })
            .end(done)
    });
});

describe('POST /users/me',()=>{
    it('should create a user',(done)=>{
        var email = 'emample@example.com'
        var password = '123mnb!'
        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy(); //lastest version of expect ,need change from .toExist() => .toBeTruthy()
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email)
            })
            .end((err)=>{
                if(err){
                    return done(err)
                }
                Users.findOne({email}).then((user)=>{ //need to import user model on the top to get {Users} 
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password); //lastest version of expect, .toNotBe() => .not.toBe()
                    done();
                }).catch((e)=>done(e));
            })
    });

    it('should return validation errors if request invalid',(done)=>{
        var email = 'example'; //need email format
        var password = '123'; //need minimum 6
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done)

    });

    it('should not create user if email in use',(done)=>{
        request(app)
            .post('/users')
            .send({
                email: users[0].email, //use the exist email whould get 400
                password: 'Password123!'
            })
            .expect(400)
            .end(done)
    });
});


describe('POST /users/login', ()=>{
    it('should login user and return auth token',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeTruthy();//lastest version of expect ,need change from .toExist() => .toBeTruthy()
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Users.findById(users[1]._id).then((user)=>{
                    expect(user.toObject().tokens[1]).toMatchObject({ //new version using .toMatchObject() instead of .toInclude()
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((e)=>done(e)); //will show why it fail
            })
    });

    it('should reject invalid login',(done)=>{
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email+'1', //fail email
                password: users[1].password
            })
            .expect(400)
            .expect((res)=>{
                expect(res.headers['x-auth']).toBeFalsy(); //0:should have no x-auth
            })
            .end((err,res)=>{
                if(err){
                    return done(err);
                }
                Users.findById(users[1]._id).then((user)=>{
                    expect(user.tokens.length).toBe(1) //0:should have no token, 1: should have length 1 after added token data in seed.js file
                    done();
                }).catch((e)=>done(e)); //will show why it fail
            })
            })
    });
describe('DELETE /users/me/token', ()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
        .delete('/users/me/token') //DELETE /users/me/token
        .set('x-auth', users[0].tokens[0].token) //Set x-auth equal to token
        .expect(200)
        .end((err,res)=>{
            if(err){ //handle the error
                return done(err);
            }
            Users.findById(users[0]._id).then((user)=>{ //Find user, verify that tokens array has length of zero
                expect(user.tokens.length).toBe(0) //should have no token
                done();
            }).catch((e)=>done(e)); //will show why it fail
        })
    })
})


//selfmade Error to learn
// describe('PATCH /todos/:id',()=>{
//     it('should updated the todo', (done)=>{
//         //grab id of first item
//         var HexId = todos[0]._id.toHexString();
//         var text = "Updated"
//         var completed = true
//         var completedAt = new Date().getTime()
//         request(app)
//         .patch(`/todos/${HexId}`)
//         .send({text,completed,completedAt})
//         .expect(200)
//         .expect((res)=>{
//             expect(res.body.todo.text).toBe(text)
//             expect(res.body.todo.completed).toBe(completed)
//             expect(res.body.todo.completedAt).toBe(completedAt)
//         })
//         .end(done)