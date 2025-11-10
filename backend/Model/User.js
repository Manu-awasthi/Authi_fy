import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type : String,  required : true},
    password: {type: String  },
    age : {type: Number  },
    email : {type : String , unique : true},
    googleId: { type: String },
    githubId: { type: String },
})

const User = mongoose.model("User" , userSchema)

export default User