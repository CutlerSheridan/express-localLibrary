const Movie = require('../models/movie');
const MovieInstance = require('../models/movieInstance');
const Director = require('../models/director');
const Genre = require('../models/genre');
const { db } = require('../mongodb_config');

const asyncHandler = require('express-async-handler');

// exports.index = asyncHandler(async (req, res, next) => {
//   res.send('NOT IMPLEMENTED: Site home page');
// });
exports.index = asyncHandler(async (req, res, next) => {
  const [
    numOfMovies,
    numOfMovieInstances,
    numOfAvailableInstances,
    numOfDirectors,
    numOfGenres,
  ] = await Promise.all([
    db.collection('movies').countDocuments({}, { hint: '_id_' }),
    db.collection('movie_instances').countDocuments({}, { hint: '_id_' }),
    db.collection('movie_instances').countDocuments({ status: 'available' }),
    db.collection('directors').countDocuments({}),
    db.collection('genres').countDocuments({}),
  ]);
  res.render('layout', {
    contentFile: 'index',
    title: 'Local Library Home',
    movie_count: numOfMovies,
    movie_instance_count: numOfMovieInstances,
    movie_instance_available_count: numOfAvailableInstances,
    director_count: numOfDirectors,
    genre_count: numOfGenres,
  });
});

exports.movie_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Movie list');
});

exports.movie_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Movie detail: ${req.params.id}`);
});

exports.movie_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Movie create GET');
});
exports.movie_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Movie create POST');
});

exports.movie_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Movie delete GET');
});
exports.movie_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Movie delete POST');
});

exports.movie_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Movie update GET');
});
exports.movie_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Movie update POST');
});
