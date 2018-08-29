
var env = process.env.NODE_ENV || 'development'
console.log('env ****', env); //to show which environment we are using

//development on local and with POSTMAN
if (env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} //test with mocha, we want to use different mongodb file to test
else if (env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}