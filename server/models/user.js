
const mongoose = require ('mongoose')

const validator = require('validator');

const jwt =require('jsonwebtoken')

const _ = require('lodash')

var UserSchema = new mongoose.Schema({
    
    email:{
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,   //set not to match other document
        validate:{
            validator: validator.isEmail, //from npm validator method ,to check if the email is valid, return true and false
            message: '{VALUE} is not a valid email'
        }
    },
    password:{
        type: String,
        require: true,
        minlength: 6
    },
    tokens:[{ //available for mongodb not sql
        access:{
            type: String,
            required:true
        },
        token:{
            type: String,
            required: true
        }
    }]
});

// return only id and email to user
UserSchema.methods.toJSON = function (){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id','email']); 
};


UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(()=>{
        return token;
    });
};


var Users = mongoose.model('Users',UserSchema);

module.exports = {Users}