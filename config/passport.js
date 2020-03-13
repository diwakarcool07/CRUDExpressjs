const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('../Model/User');
const User =mongoose.model('users');




module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField:"email"},(email,password,done) =>{
            User.findOne({email:email}).then(user =>{
                if(!user){
                    return done(null,false,{
                        message:'no user found please create account first'})
                }
                bcrypt.compare(password,user.password,(err,isMatch) =>{
                    if(err) throw err;
                    if(isMatch){
                        return (null,user)
                    }else{
                        return (null,false,{message:'password is not matching'})
                    }
                })
            }).catch(err =>console.log(err))
        }));




        passport.serializeUser(function(user, done) {
            done(null, user.id);
          });
          
          passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
              done(err, user);
            });
          });

}