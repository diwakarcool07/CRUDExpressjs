const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');


const router = express.Router();

//load user schema
require('../Model/User');
const User = mongoose.model("users");


router.get('/login',(req,res) =>{
    res.render('auth/login')
});
router.get('/register',(req,res) =>{
    res.render('auth/register')
});



//post route here for creating user register information in database
router.post("/register",(req,res) =>{
    const errors =[];
    if(req.body.password != req.body.confirmpassword){
        errors.push({text:'password is not matched'})
    }
    if(req.body.password.length <4){
        errors.push({text:'password should be minimum of 4 characters'})
    }
    if(errors.length >0){
        res.render("auth/register",{
            errors:errors,
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword});
    }
    else{
        //res.send('ok')
        //connect to database and store user information
        User.findOne({email:req.body.email}).then(user =>{
            if(user){
            req.flash("error_msg","Email is already exits..;)");
            res.redirect("/user/register");
            }else{
                const newUser = new User({
                    username:req.body.username,
                    email:req.body.email,
                    password:req.body.password,
                    confirmpassword:req.body.confirmpassword
                });
                bcrypt.genSalt(10,(err,salt) =>{
                    bcrypt.hash(newUser.password,salt,(err,hash) =>{
                        if(err) throw err;
                        newUser.password=hash;
                newUser.save().then(user =>{
                    console.log(user);
                    req.flash("success_msg","successfully registered");
                    res.redirect('/user/login')
                    
                }).catch(err =>console.log(err))
            })
        })
            }
        }).catch(err =>console.log(err));
    }
});




router.post('/login',(req,res,next) =>{
  passport.authenticate('local', 
  { successRedirect:'/profile/userprofile',
  failureRedirect: '/user/login',
  failureFlash:true })(req,res,next);});



router.get('/logout',(req,res) =>{
    req.logout();
    req.flash("success_msg","successfully logout..;)");
    res.redirect('/user/login')
});

module.exports=router;