
const mongoose = require ('mongoose');

const validator = require('validator');

const jwt =require('jsonwebtoken');

const _ = require('lodash');

const bcrypt = require('bcryptjs');

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
    var user = this; //instant method 
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(()=>{
        return token;
    });
};

UserSchema.statics.findByToken = function(token) {
    var User = this 
    var decoded; 
    //try-catch block
    try{
        decoded = jwt.verify(token, 'abc123')
    }catch(e){
        // return new Promise((resolve, reject)=>{
        //     reject();
        // }); , Promise.reject() below will do the same
        return Promise.reject()
    }
    //below code will run if no error from try catch block
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'

    });
};

//// make this findByCredentials model for POST /users/login {email, password} 
UserSchema.statics.findByCredentials = function(email, password){
    var User = this;
    //there is no password store in our database to compare
    //find email and verify password
    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        
        return new Promise((resolve, reject)=>{
            //Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password,(err,res)=>{ //user.password is hashed
                if(res){
                   resolve(user)
                }
                else{
                    reject(); //will send 400 back
                }
            })
        })
    })
};

//we want to run save before we save to database, *have to provide next and call it*
UserSchema.pre('save', function(next){
    var user = this;
    //.ismodified take individual property if password was modified
    if(user.isModified('password')){
        //above, const bcrypt = require('bcryptjs')
        // we want to hash 'user.password'
        bcrypt.genSalt(10, (err,salt)=>{//bigger number is longer algorithm
            bcrypt.hash(user.password, salt, (err,hash)=>{ //we want to install the hash in database server
                user.password = hash;
                next(); //without next() , code will fail
            });//if success, we can check in mongodb if the password is already hashed 
        });
    }else{
        next()
    }
});


var Users = mongoose.model('Users',UserSchema);

module.exports = {Users}