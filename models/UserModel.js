const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    profile:String,
    name:String,
    bio:String,
    phone:Number,
    email:{
        type:String,
        
    },
    password:{
        type:String,
        require:true,
    }
})

const UserModel = mongoose.model('user',userSchema);

module.exports = {UserModel}