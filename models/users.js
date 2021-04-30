const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    wishListArticlesId : [{type: mongoose.Schema.Types.ObjectId, ref : 'article'}],
    userlanguage: String
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel