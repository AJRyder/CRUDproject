const express = require('express')
const router = express.Router();
const Movie = require('../../models/movies')
const User = require('../../models/users')

router.get('/', (req, res) => {
    if(req.session.logged){
          Movie.find({}, (err, foundMovie)=>{
              res.render('movies/index.ejs', {
                  movies: foundMovie
                });
             })
      } else {
        res.redirect('/sessions/login')
        console.log(req.sessions, "<--- this is the req.session info")
      }
  });

// index route 
router.get('/', async(req, res)=>{
    try { 
        const foundMovies = await Movie.find({}); 
        res.render('movies/index.ejs', {
            movies: foundMovies
        })
    } catch(err) { 
        res.send(err)
        console.log(err)
    }
})

//new route 
router.get('/new', async(req, res)=>{
    try{
        const allUsers = await User.find({});
        res.render('movies/new.ejs', {
            users: allUsers
        })
    } catch { 
        console.log(err)
        res.send(err)
    }
})

//show route 

router.get('/:id', async(req,res)=>{
   try {
       const foundUser = await User.findOne({'watchList':req.params.id}).populate('watchList')
       const movie = await Movie.findById(req.params.id)
       res.render('movies/show.ejs', {
           user: foundUser,
            movie: movie,
            currentUser: req.session.currentUser
       })
    } catch(err) { 
        console.log(err)
        res.send(err)

    }
});


// post route 

router.post('/', async(req,res)=>{
    try {
        const createdMovie = await Movie.create(req.body)
        const foundUser = await User.findById(req.body.userId)
        foundUser.watchList.push(createdMovie)
        foundUser.save()
        res.redirect('/movies')
    } catch(err) {
        console.log(err)
        res.send(err)
    }
})

// edit route 
router.get('/:id/edit', async(req,res)=>{
    try {
        const movie = await Movie.findById(req.params.id)
        res.render('movies/edit.ejs', {
            movie,
        })
    } catch(err) { 
        res.send(err)
        console.log(err)
    }
})

// put route 
router.put('/:id', async(req, res)=>{
    try { 
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.redirect('/movies')
    } catch(err) { 
        console.log(err)
        res.send(err)
    }
})

// delete route 

router.delete('/:id', async(req, res)=>{
    try {
        const deletedMovie = await Movie.findByIdAndRemove(req.params.id)
        res.redirect('/movies')
        console.log(deletedMovie)
    } catch(err) { 
        console.log(err)
        res.send(err)
    }
})





module.exports = router 