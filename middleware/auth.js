module.exports = {
    ensureAuth: function(req,res,next){
        if(req.isAuthenticated){
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