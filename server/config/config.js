
var env = process.env.NODE_ENV || 'development'
console.log('env ****', env); //to show which environment we are using

//improving App configuration 
if(env=== 'development'|| env ==='test'){
    var config = require('./config.json');
    // console.log(config);
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key)=>{ //take object get the key and return as array
        process.env[key] = envConfig[key]
    }) 
}

//Moved to config.json for improving config
//development on local and with POSTMAN
// if (env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
// } //test with mocha, we want to use different mongodb file to test
// else if (env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
// }