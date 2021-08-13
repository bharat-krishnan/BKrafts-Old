const express = require('express');
const passport = require('passport');
const router = express.Router();

//GET /auth/google
//Authorization with google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));

//GET /auth/google/callback
//Google callback for authorization
router.get('/google/callback', passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        if(req.user.email === "bharatpkrishnan@gmail.com")
            res.redirect('/admin');
        else
            res.redirect('/dashboard');
    }
);

//GET /auth/logout
router.get('/logout', (req,res) => {
    req.logout();
    console.log(req.isAuthenticated);
    console.log(req.user);
    console.log('successfully logged out');
    res.redirect('/');
});


//Exporting Router
module.exports = router;