const mongoose = require('mongoose')

const wishListArticleSchema = mongoose.Schema({
    title : String,
    description : String,
    content : String,
    image : String,
})

const wishListArticleModel = mongoose.model('article', wishListArticleSchema)

module.exports = wishListArticleModel