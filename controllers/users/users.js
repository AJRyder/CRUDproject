const express = require('express')
const router = express.Router()
const User = require('../../models/users')
const Movie = require('../../models/movies')
const bcrypt = require('bcryptjs')


router.post('/login', (req, res) => { 
  req.session.username = req.body.username;
  req.session.email = req.body.email; 
  req.session.logged   = true;
  console.log(req.session);
  res.redirect('/users')
});

router.post('/', async (req, res) => {
  if(req.session.logged === true){
    try {  
        const createdUser = await User.create(req.body);
        res.redirect('/users')
    } catch(err){
        res.send(err);
    }
  } else {
    req.session.logOutMsg = "you must be logged in"
    res.redirect('/')
    res.send('not logged in');
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy(function(err){
  
	    if(err){
	      // do something
	    } else {
	      res.redirect('/')
	    }
  })
})



//index route 
router.get('/', async(req, res)=>{
  try { 
      const allUsers = await User.find({}); 
      res.render('users/index.ejs', {
          users: allUsers
      })
      } catch(err) { 
      res.send(err)
      console.log(err)
  }
})

//new route
router.get('/new', (req, res)=>{
  res.render('users/new.ejs')
});

//show route 
router.get('/:id', async(req,res)=>{
  try {
      const user = await User.findById(req.params.id).populate('watchList')
      console.log(user, 'THIS IS USER USER USER')
      res.render('users/show.ejs', {
          user,
      });
  } catch(err){
    console.log(err)
    res.send(err)
  }
});

// Post route 
router.post('/', async(req,res)=>{
  try{
    const createdUser = await User.create(req.body)
    res.redirect('/users', {
      user: createdUser,
    })
  } catch (err){
    console.log(err)
    res.send(err)
}
});

// Put route 
router.put('/:id', async(req,res)=>{
  try{
      const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
      if(req.body.newWatchList) {
        updateUser.watchList.push(req.body.newWatchList)
        updateUser.save()
      }
      console.log(updateUser, '<---------- THIS IS THE UPDATED USER WITH NEW WATCHLIST')
      res.redirect('/users/'+ req.params.id)
  } catch {
      res.send(err)
      console.log(err)
  }
});

// Edit Route 
router.get('/:id/edit', async(req, res)=>{
  try {
      const editUser = await User.findById(req.params.id)
      res.render('users/edit.ejs', {
          user: editUser, 
      });
  } catch(err){
      res.render(err)
      console.log(err)
  }
});

// delete route 
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    const deletedMovies = await Movie.remove({_id: {$in: deletedUser.movies}})
    res.redirect('/users');
  } catch(err) {
    res.send(err);
  }
});


module.exports = router