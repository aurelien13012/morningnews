var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')
const wishListArticleModel = require('../models/wishListArticle')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent en bdd')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      wishListArticlesId : []
    })
  
    saveUser = await newUser.save()
    console.log('newusersaved', saveUser)
  
    
    if(saveUser){
      result = true
      token = saveUser.token
    }
  }
  

  res.json({result, saveUser, error, token})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  
  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    const user = await userModel.findOne({
      email: req.body.emailFromFront,
    })
  
    
    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
      } else {
        result = false
        error.push('mot de passe incorrect')
      }
      
    } else {
      error.push('email incorrect')
    }
  }
  

  res.json({result, user, error, token})


})

router.get('/addarticles', async function(req, res, next) {

  var newarticle = new wishListArticleModel({
    title : req.query.title,
    description : req.query.description,
    content : req.query.content,
    image : req.query.urlToImage,
  })

  await newarticle.save()

  let user = await userModel.findOne({token : req.query.token})
                                      // .populate('article')
                                      // .exec()
  console.log('user',user)
//On sauve la liste des articles id du user dans une nouvelle variable
  let userWishList = user.wishListArticlesId
  console.log('wishlist1', userWishList)

  //on ajoute le nouvel id de larticle
  userWishList.push(newarticle.id)
  console.log('wishlist2', userWishList)

  // console.log('user2',user2)
  // await user2.save()

  //on met a jour la bdd : 1.je recupère le user par son token (filtre) 2.on dit ce qu'on veut mettre à jour
  let userList = await userModel.updateOne({token : req.query.token}, { wishListArticlesId : userWishList })


  res.json({userList})
})

module.exports = router;
