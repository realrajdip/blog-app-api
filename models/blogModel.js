const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectID,
        required:true,
        ref:'User'
    },
    title:{
        type:String,
        required:[true, 'Please add a title']
    },
    body:{
        type:String,
        required:[true, 'Please add a story']
    },
    author:{
        type:String,
        required:[true, 'Please add an author name']
    }
},{
    timestamps:true,
})


module.exports = mongoose.model('Blog', blogSchema)