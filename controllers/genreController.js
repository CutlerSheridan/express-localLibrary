const Genre = require('../models/genre');
const Movie = require('../models/movie');
const { db, ObjectId } = require('../mongodb_config');

const asyncHandler = require('express-async-handler');

exports.genre_list = asyncHandler(async (req, res, next) => {
  const allGenresRaw = await db
    .collection('genres')
    .find({})
    .sort({ name: 1 })
    .toArray();
  const allGenres = Genre(allGenresRaw);
  res.render('layout', {
    contentFile: 'genre_list',
    title: 'Genre List',
    genres: allGenres,
  });
});

exports.genre_detail = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const [genreDoc, moviesOfGenreRaw] = await Promise.all([
    db.collection('genres').findOne({ _id: id }),
    db
      .collection('movies')
      .find({ 'genre._id': id })
      .sort({ title: 1 })
      .toArray(),
  ]);
  if (genreDoc === null) {
    const err = new Error('Genre not found');
    err.status = 404;
    return next(err);
  }
  const genre = Genre(genreDoc);
  const moviesOfGenre = [];
  moviesOfGenreRaw.forEach((movie) => {
    moviesOfGenre.push(Movie(movie));
  });

  res.render('layout', {
    contentFile: 'genre_detail',
    title: 'Genre Detail',
    genre,
    movies: moviesOfGenre,
  });
});

exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre create GET');
});
exports.genre_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre create POST');
});

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre delete GET');
});
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre delete POST');
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
});
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
});
