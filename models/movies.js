const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {type: String, required: true}, 
    releaseYear: String, 
    posterUrl: {type: String, required: true}, 
    shotOn: [String],
    lenses: [String],
    aspectRatio: String, 
    director: String, 
    dop: String,
    synopsis: String, 
    Cast: [String],
    Crew: [String], 
    shootRegions: String, 
    trailer: String,
});

module.exports = mongoose.model('Movie', movieSchema);