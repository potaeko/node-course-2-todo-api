

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp'); //***connect to TodoApp ***

module.exports = {//mongoose:mongoose
    mongoose  
};