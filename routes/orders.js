const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

//GET /orders/add
//Show add page
router.get('/add', ensureAuth, (req,res) =>{
    res.render('orders/add');
});

//GET /orders/user/:userid
//Show add page
router.get('/user/:userid', ensureAuth, async (req,res) =>{
    console.log('calling here');
    try{

        let user = await User.findById(req.params.userid).lean();
        let orders = await Order.find({user: req.params.userid}).sort({createdAt: 'desc'}).lean();
        console.log(orders);
        res.render('orders/user',{
            user,
            orders
        })
    }
    catch(err){
        res.render('error/500');
    }
});

//GET /orders/:id
//Show add page
router.get('/:id', ensureAuth, async (req,res) =>{
    try{
        let order = await Order.findById(req.params.id).populate('user').lean();
        if(!order){
            res.render('error/404');
        }
        else{
            console.log('hello test');
            if(req.user.id == order.user._id || req.user.email === "bharatpkrishnan@gmail.com"){
                res.render('orders/show', {
                    order,
                    user: req.user
                })
            }
            else{
                res.redirect('/dashboard');
            }
        }
    }
    catch(err){
        res.render('error/404');
    }
});


//POST /orders
//Process new order form
router.post('/', ensureAuth, async (req,res) =>{
    try{
        req.body.user = req.user.id;
        await Order.create(req.body);
        res.redirect('/dashboard');
    }
    catch(err){
        console.error(err);
        res.render('error/500');
    }
})

//GET /orders/edit/:id
//Show edit page
router.get('/edit/:id', ensureAuth, async (req,res) =>{
    
    try{
    const order = await Order.findOne({
        _id:req.params.id
    }).lean();

    if(!order){
        res.render('error/404');
    }
    if(order.user != req.user.id){
        res.redirect('dashboard');
    }
    else{
        res.render('orders/edit', {
            order
        })
    }}
    catch(err)
    {
        res.render('error/500');
    }
});

//PUT /orders/edit/id
//Update Order
router.put('/:id', ensureAuth, async (req,res) =>{
    try{
    let order = await Order.findById(req.params.id).lean();
    if(!order){
        return res.render('error/404');
    }
    if(req.user.id != order.user){
        res.render('error/404');
    }
    else{
        order = await Order.findOneAndUpdate({_id: req.params.id}, req.body,
            {
                new:true,
                runValidators: true
            });
        res.redirect('/dashboard');
    }}
    catch(err){
        res.render('error/500');
    }
});

//DELETE /orders/:id
//Delete Story
router.delete('/:id', ensureAuth, async (req,res) =>{
    try{
        let order = await Order.findById(req.params.id).lean()

            if (!order) {
            return res.render('error/404');
            }

            if (order.user != req.user.id) {
                res.redirect('/dashboard');
            } else {
                await Order.remove({ _id: req.params.id })
                res.redirect('/dashboard')
            }
        
    }
    catch(err){
        res.render('error/500');
    }
});

//Exporting Router
module.exports = router;