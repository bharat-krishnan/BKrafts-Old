const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest, ensureAdmin} = require('../middleware/auth');
const Order = require('../models/Order');
//GET /
//Home Page w/ Login Button
router.get('/', ensureGuest, (req,res) =>{
    res.render('home', {
        layout: 'login'
    });
});

//GET /dashboard
//User Dashboard
router.get('/dashboard', ensureAuth, async (req,res) =>{
    try{
        const orders = await Order.find({user: req.user.id}).populate('user').sort({createdAt: 'desc'}).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            orders,
            email: req.user.email
        });
    }
    catch(err)
    {
        res.render('error/500');
    }

});

//GET /admin
//Admin Dashboard
router.get('/admin', ensureAdmin, async (req,res) =>{
    try{
        const orders = await Order.find().populate('user').sort({createdAt: 'desc'}).lean();
        res.render('admin', {
            name: req.user.firstName,
            orders,
            email: req.user.email
        });
    }
    catch(err)
    {
        res.render('error/500');
    }
});

//Exporting Router
module.exports = router;