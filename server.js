const express = require('express');
const mongoose=require('mongoose');
const exphbs = require('express-handlebars');
const multer = require('multer');
const bodyParser = require('body-parser');
const Handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');//for displaying date format
const methodOverride = require('method-override');
const passport = require('passport');



var session = require('express-session');//for displaying message
var flash = require('connect-flash');//for displaying message



//create express appliction with the help of express function();
const app = express();



//load profile routes file/block
const profile = require('./Routes/profile');


//load auth routes file or block
const users = require('./Routes/auth');


//loading passport module
require('./config/passport')(passport);




//date handlebars for displaying date register
HandlebarsIntl.registerWith(Handlebars);



//use session middleware here for displaying message
app.use(
    session({
        secret:"keyboard cat",
        resave:false,
        saveUninitialized:true,
    })
);


//use these two passport method
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());


//create global middleware for displaying message over the all page
app.use((req,res,next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.errors_msg = req.flash('errors_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next()
});





//method override middleware here
app.use(methodOverride('_method'));






//connecting database mongodb

const mongodbUrl="mongodb+srv://diwakar:diwakar07@cluster0-84r8r.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(mongodbUrl,{useUnifiedTopology:true,useNewUrlParser:true},
    (err)=>{
        if(err) throw err;
        console.log("mongoose is connected");
        
    });

// set template(view) engine middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');




//serving static file
app.use(express.static(__dirname + '/public'));

//use handlebars for uploading dynamic pic and displaying on the page
Handlebars.registerHelper("trimString",function (passedString){
    var theString =[...passedString].splice(6).join("");
    return new Handlebars.SafeString(theString);
});





//bodyparser middleware here
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());





//basic routing
app.get("/",(req,res)=>{
    //res.send("app is running");
    res.render('home.handlebars');
});




//middleware  profile/profile.js
app.use("/profile",profile);
//user middleware here
app.use('/user',users);


//pagenotfound route
app.get("**",(req,res)=>{
    res.render('404.handlebars')
})


//create port and server
const port=process.env.PORT || 2929;
app.listen(port,(err)=>{
    if(err) throw err;
    else
    console.log("server is running in port:"+port);
    
})
