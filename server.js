
const express             = require('express')
const app                 = express();
const bodyParser          = require('body-parser')
const methodOverride      = require('method-override')
const session             = require('express-session')
const bcrypt              = require('bcryptjs')
require('dotenv').config()


//database
require('./db/db');

const PORT = process.env.PORT


//middleware

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(methodOverride('_method'));
  app.use(express.static('public'))

  app.use(session({
    secret: "is this the martini", 
    resave: false, 
    saveUninitialized: false 
  }));


  app.use((req, res, next) => {
    res.locals.user = req.session.user || {
    }
    res.locals.logOutMsg = "LOGOUT"
    next();
  });

//Home page route 
app.get('/',(req, res) => {
  res.render('index.ejs', {
    user: req.session.currentUser,
    message: req.session.message,
    logOut: req.session.logOutMsg 
  })
});



//controllers
  const moviesController = require('./controllers/movies/movies.js');
  app.use('/movies', moviesController);
  
  const usersController = require('./controllers/users/users.js');
  app.use('/users', usersController)

  const authController = require('./controllers/auth.js');
  app.use('/auth', authController)




  app.listen(PORT, () => {
    console.log(`server listening on port, ${PORT})`;
  });

  