
var mongoose = require('mongoose')

var Todo = mongoose.model('Todo',{  //.model take (string, Object)
    text: {
        type: String, //type string
        //set default https://mongoosejs.com/docs/validation.html
        required: true, //if add data without text, will get error
        minlength: 1,  //min 1 character
        trim: true //delete all the space front and behind
    },
    completed: {
        type: Boolean,
        default: false //set default to false
    },
    completedAt:{
        type: Number,
        default: null //set default to null
    },
    _creator:{ 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Todo};