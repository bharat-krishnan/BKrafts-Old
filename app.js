//Creating Server and Database
const express = require('express');
const app = express();

//Setting Up Config File and Variables
const dotenv = require ('dotenv');
dotenv.config({path: './config/config.env' });

//Set Up Body Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Require Passport and Sessions
const passport = require('passport');
const session = require('express-session');
require('./config/passport.js')(passport);

//Setting Up Mongo Session Storage
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');

//Setting Up Static Folder
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

//Connecting to Database
const connectDB = require('./config/db.js');
connectDB();

//Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoDBStore.create({
        mongoUrl: process.env.MONGO_URI
    })
  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());


//Handlebar Helpers
const {formatDate, select} = require('./helpers/hbs.js');

//Setting up Handlebars & adding one logic helper                                                                                                                                                                        
const exphbs = require('express-handlebars');
app.engine('hbs', exphbs({helpers: {
    formatDate, select
}, defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', '.hbs');

const hbs = exphbs.create({});

hbs.handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if(v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });


//Setting up Method Override
const methodOverride = require('method-override');
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//Setting up Logging for Development MODE
const morgan = require('morgan');
const { Mongoose } = require('mongoose');
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Require Routes
app.use('/', require('./routes/index.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/orders', require('./routes/orders.js'));

//Starting Up Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

