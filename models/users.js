const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String, 
  profilePic: String,
  favoriteGenre: String, 
  watchList:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie'
}]
});


module.exports = mongoose.model('User', userSchema);