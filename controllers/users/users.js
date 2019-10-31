const express = require('express')
const router = express.Router()
const User = require('../../models/users')
const Movie = require('../../models/movies')
const bcrypt = require('bcryptjs')


router.post('/login', (req, res) => { 
  req.session.username = req.body.username;
  req.session.email = req.body.email; 
  req.session.logged   = true;
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


//index route 
router.get('/', async(req, res)=>{
  try { 
      const allUsers = await User.find({});
      console.log(req.session.currentUser) 
      res.render('users/index.ejs', {
          users: allUsers,
         currentUser: req.session.username
      })
      } catch(err) { 
      res.send(err)
  }
})

// //new route
// router.get('/new', (req, res)=>{
//   res.render('users/new.ejs')
// });

//show route 
router.get('/:id', async(req,res)=>{
  try {
      const user = await User.findById(req.params.id).populate('watchList')
      res.render('users/show.ejs', {
          user,
          currentUser: req.session.username
      });
  } catch(err){
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
      } else if(req.body.removedMovie) {
        const index = updateUser.watchList.indexOf(req.body.removedMovie)
        updateUser.watchList.splice(index, 1)
        console.log(updateUser.watchList)
        updateUser.save()
        // const newWatchList = updateUser.watchList.filter(movie => movie._id !== removedMovie)
        // updateUser.watchList = newWatchList
        // updateUser.save()
      }
      res.redirect('/users/'+ req.params.id)
  } catch {
    console.log(err)
      res.send(err)
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