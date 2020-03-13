module.exports={
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();
        } else{
            req.flash("error_msg","you are not authorized user please login");
            res.redirect('/auth/login');

        }
    }
}