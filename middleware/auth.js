module.exports = {
    ensureAuth: function(req,res,next){
        if(req.user){
            return next();
        }
        else{
            res.redirect('/');
        }
    },
    ensureGuest:function(req,res,next){
        if(!req.user){
            return next();
        }
        else{
            if(req.user.email == "bharatpkrishnan@gmail.com")
                res.redirect('/admin');
            else
             res.redirect('/dashboard');
        }
    },
    ensureAdmin:function(req,res,next){
        if(req.isAuthenticated && req.user.email === "bharatpkrishnan@gmail.com"){
            return next();
        }
        else{
            res.redirect('/');
        }
    }
}