

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true } ); //***connect to TodoApp ***

module.exports = {//mongoose:mongoose
    mongoose  
};