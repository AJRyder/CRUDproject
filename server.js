const express             = require('express')
const app                 = express();
const bodyParser          = require('body-parser')
const methodOverride      = require('method-override')
const session             = require('express-session')
const bcrypt              = require('bcryptjs')

//database
require('./db/db');

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
    res.locals.user = req.session.user || {}
    next();
  });

//Home page route 
app.get('/',(req, res) => {
  console.log(req.session, 'home route')
  res.render('index.ejs', {
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




  app.listen(3000, () => {
    console.log('server listening on port', 3000);
  });

  