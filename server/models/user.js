
var mongoose = require ('mongoose')

var Users = mongoose.model('Users',{
    User:{
        type :String,
    },
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

module.exports = {Users}