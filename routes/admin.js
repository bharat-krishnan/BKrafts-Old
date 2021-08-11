const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const Order = require('../models/Order');


//Exporting Router
module.exports = router;