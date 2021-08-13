const express = require('express');
const router = express.Router();
const {ensureAuth, ensureAdmin} = require('../middleware/auth');
const Order = require('../models/Order');

//GET /admin/edit/:id
//Show edit page
router.get('/edit/:id', ensureAdmin, async (req,res) =>{
    
    try{
    const order = await Order.findOne({
        _id:req.params.id
    }).lean();

    if(!order){
        res.render('error/404');
    }
    else{
        res.render('admin/edit', {
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
router.put('/:id', ensureAdmin, async (req,res) =>{
    try{
    let order = await Order.findById(req.params.id).lean();
    if(!order){
        return res.render('error/404');
    }

    else{
        order = await Order.findOneAndUpdate({_id: req.params.id}, req.body,
            {
                new:true,
                runValidators: true
            });
        res.redirect('/admin');
    }}
    catch(err){
        res.render('error/500');
    }
});



//Exporting Router
module.exports = router;