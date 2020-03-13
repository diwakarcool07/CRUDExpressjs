const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const router = express.Router();

module.exports=router;//router object


const {ensureAuthenticated} = require("../helper/auth");


//load profile schema model
require('../Model/Profile');
const Profile = mongoose.model('profile');




//multer middleware to uploading purpose
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/uploads')
    },
    filename:function(req,file,cb){
        cb(null,Date.now() +file.originalname)
    }
});
const upload = multer({storage:storage});





//for rendering addprofile page
router.get("/addprofile",(req,res)=>{
    res.render("profile/addprofile");
});


//call profile page route
router.get('/userprofile',(req,res)=>{
    Profile.find({}).then(  profile => {
        res.render('profile/userprofile',{
            profile:profile
        })
    }).catch((err)=>console.log(err));
});


//create editprofile route
router.get('/editprofile/:id',(req,res) =>{
    //need to access database primary key id
    //collection name here
    Profile.findOne({_id:req.params.id}).then(profile=>{
        res.render('profile/editprofile',{
            profile:profile
        })
    }).catch(err=>console.log(err))
});







//create profile by using http post method
router.post('/addprofile',upload.single('photo'),(req,res)=>{
    const errrors = [];
    if(!req.body.name){
        errrors.push({text:"name is required"})
    }
    if(!req.body.phonenumber){
        errrors.push({text:"phonenumber is required"})
    }
    if(!req.body.company){
        errrors.push({text:"phonenumber is required"})
    }
    if(!req.body.location){
        errrors.push({text:"location is required"})
    }
    if(!req.body.education){
        errrors.push({text:"education is required"})
    }
    if(errrors.length>0){
        res.render('profile/addprofile',{
            errrors:errrors,
            name:req.body.name,
            phonenumber:req.body.phonenumber,
            company:req.body.company,
            location:req.body.location,
            education:req.body.education
        })
    } else{
        const newProfile ={
            photo:req.file,
            name:req.body.name,
            phonenumber:req.body.phonenumber,
            company:req.body.company,
            location:req.body.location,
            education:req.body.education
         }
         new Profile(newProfile).save().then(profile =>{
             console.log(profile);
             req.flash('success_msg','successfully profile created')
             res.redirect('/profile/userprofile')
             }).catch(err=>
             console.log(err));
    }
});



//call edit profile put method route here
router.put('/editprofile/:id',upload.single('photo'),(req,res)=>{
    //first find database collection
    Profile.findOne({_id:req.params.id}).then(profile=>{
        profile.photo=req.file;
        profile.name=req.body.name;
        profile.phonenumber=req.body.phonenumber;
        profile.company=req.body.company;
        profile.location=req.body.location;
        profile.education=req.body.education
        
        //after this you have to save data to database
        profile.save().then(profile =>{
            res.redirect('/profile/userprofile')
        }).catch(err =>console.log(err))
    }).catch(err=>console.log(err))
});



//delete profile route with the help of http delete method
router.delete("/deleteprofile/:id",(req,res) =>{
    Profile.remove({_id:req.params.id}).then(profile =>{
        res.redirect('/profile/userprofile')
    }).catch(err =>console.log(err))
})