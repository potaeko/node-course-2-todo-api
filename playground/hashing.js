
//JSON WEB TOKEN, there is Two parts: create and verify

//For example purpose ,we are using crypto-js
//we require property SHA256  from crypto-js 
const {SHA256} = require('crypto-js');

var message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`)
console.log(`HASH: ${hash}`)


//==#1 Create Token part
var data = {
    id: 4
};

//user can manipulate data id ,but they won't know 'somesecret' in server
var token = {
    data, 
    hash: SHA256(JSON.stringify(data)+'somesecret').toString() //convert object to string
}

//User try to manipulate token by having different id but same token which user does not know 'somesecret' 
token.data.id=5
token.hash = SHA256(JSON.stringify(token.data)).toString()

//==#2 To verify Token part
var resultHash = SHA256(JSON.stringify(token.data)+'somesecret').toString();

if(resultHash=== token.hash){
    console.log('Data was not change')
}else{
    console.log('Data was changed. Do not trust')
}


//******************** JWT ***********************/

//For real app, we are using jsonwebtoken
const jwt = require('jsonwebtoken')

var data = {
    id:10
}

//JSON WEB TOKEN, there is Two parts: create and verify
//jwt.sign take (object, secretCode aka signature)
var token = jwt.sign(data, '123abc');
console.log(token)

//take token and secretCode
var decoded = jwt.verify(token, '123abc')
console.log('decoded:',decoded)

//*******************  BCRYPT  ***********************/
const bcrypt = require('bcryptjs')

var password = '123abc!';

//.gensalt , .hash to use 
bcrypt.genSalt(10, (err,salt)=>{//bigger number is longer algorithm
    bcrypt.hash(password, salt, (err,hash)=>{ //we want to install the hash in database server
        console.log(hash)
    });
});

var hashedPassword = '$2a$10$iSGSQzoYb2QSXMwl9Ta12eyuLhxiRdW9rmu.MT.ML3bHnpgCLmlqu'

//.compare
bcrypt.compare(password,hashedPassword, (err,res)=>{
    console.log(res); //true, when the password and hashedPassword is the same
})
