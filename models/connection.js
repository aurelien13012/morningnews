var mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://Aurelien:lacapsule@cluster0.cylru.mongodb.net/morningnews?retryWrites=true&w=majority',
    options,
    function(err){
        if(err) {
        console.log(err);
    }else{
        console.log('_______BDD OKAY_________')} }
    )

module.exports = mongoose