const Genre = require('../models/genre');
const Movie = require('../models/movie');
const { db, ObjectId } = require('../mongodb_config');
const { body, validationResult } = require('express-validator');
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

exports.genre_create_get = (req, res, next) => {
  res.render('layout', {
    contentFile: 'genre_form',
    title: 'Create Genre',
  });
};
exports.genre_create_post = [
  // validate and sanitize name field
  body('name', 'Genre name must have at least two characters')
    .trim()
    .isLength({ min: 2 })
    .escape(),
  // process request after validation and sanitization
  asyncHandler(async (req, res, next) => {
    console.log(req.body);
    // extract validation errors from request
    const errors = validationResult(req);
    // normalize capitalization
    let genreName = '';
    let oldNameArray = req.body.name.split(' ');
    oldNameArray.forEach((word, index) => {
      const firstLetterUppercase = word.charAt(0).toUpperCase();
      const remainderOfWordLowercase = word.slice(1).toLowerCase();
      genreName += firstLetterUppercase + remainderOfWordLowercase;
      if (index < oldNameArray.length - 1) {
        genreName += ' ';
      }
    });

    // create Genre object with escaped and trimmed data
    const genre = Genre({ name: genreName });

    if (!errors.isEmpty()) {
      // this means there are errors. render form again w/ sanitized values/error messages
      res.render('layout', {
        contentFile: 'genre_form',
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });
      return;
    } else {
      // data from form is valid
      // check if genre with same name already exists
      const re = new RegExp(req.body.name, 'i');
      const genreExists = await db
        .collection('genres')
        .findOne({ name: { $regex: re } });
      if (genreExists) {
        // genre already exists, redirect to details page
        res.redirect(Genre(genreExists).getUrl());
      } else {
        await db.collection('genres').insertOne(genre);
        // new genre saved; redirect to details page
        res.redirect(genre.getUrl());
      }
    }
  }),
];

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const [genreDoc, movieDocs] = await Promise.all([
    db.collection('genres').findOne({ _id: id }),
    db
      .collection('movies')
      .find({ 'genre._id': id })
      .sort({ title: 1 })
      .toArray(),
  ]);
  const genre = Genre(genreDoc);
  const movies = movieDocs.map((x) => Movie(x));

  res.render('layout', {
    contentFile: 'genre_delete',
    title: 'Delete Genre',
    genre,
    movies,
  });
});
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.body.genre_id);
  const [genreDoc, movieDocs] = await Promise.all([
    db.collection('genres').findOne({ _id: id }),
    db
      .collection('movies')
      .find({ 'genre._id': id })
      .sort({ title: 1 })
      .toArray(),
  ]);
  const genre = Genre(genreDoc);
  const movies = movieDocs.map((x) => Movie(x));

  if (movies.length) {
    res.render('layout', {
      contentFile: 'genre_delete',
      title: 'Delete Genre',
      genre,
      movies,
    });
  }
  await db.collection('genres').deleteOne({ _id: id });
  res.redirect('/catalogue/genres');
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update GET');
});
exports.genre_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Genre update POST');
});
