const mongoose= require('mongoose')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    age:{
        type:Number,
        require:true
    }
},{timestamps:true})

module.exports=mongoose.model('User',UserSchema)