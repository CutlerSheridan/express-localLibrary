const Director = require('../models/director');
const Movie = require('../models/movie');
const { to_date_yyyy_mm_dd } = require('./date_utility');
const { db, ObjectId } = require('../mongodb_config');
const asyncHandler = require('express-async-handler');
const { body, validationResult, oneOf } = require('express-validator');
const debug = require('debug')('director');

exports.director_list = asyncHandler(async (req, res, next) => {
  const allDirectorsRaw = await db
    .collection('directors')
    .find({})
    .sort({ lastName: 1 })
    .toArray();
  const allDirectors = Director(allDirectorsRaw);
  res.render('layout', {
    contentFile: 'director_list',
    title: 'Director List',
    directors: allDirectors,
  });
});

exports.director_detail = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const [directorDoc, movieDocs] = await Promise.all([
    db.collection('directors').findOne({ _id: id }),
    db
      .collection('movies')
      .find({ 'director._id': id })
      .sort({ title: 1 })
      .toArray(),
  ]);
  const director = Director(directorDoc);
  const movies = movieDocs.map((x) => Movie(x));

  res.render('layout', {
    contentFile: 'director_detail',
    title: director.getName(),
    director,
    movies,
  });
});

exports.director_create_get = asyncHandler(async (req, res, next) => {
  res.render('layout', {
    contentFile: 'director_form',
    title: 'Create Director',
  });
});
exports.director_create_post = [
  // FYI don't actually use .isAlphanumeric() with names, this is just to show chaining
  oneOf([body('first_name').notEmpty(), body('last_name').notEmpty()], {
    message: 'A first or last name must be provided',
  }),
  body('first_name')
    .trim()
    .isAlphanumeric()
    .escape()
    .withMessage('First name should only contain alphanumeric characters'),
  body('last_name')
    .trim()
    .isAlphanumeric()
    .escape()
    .withMessage('Last name should only contain alphanumeric characters'),
  body('birth_date', 'Invalid date of birth')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('death_date', 'Invalid date of death')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const director = Director({
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      birthDate: req.body.birth_date,
      deathDate: req.body.death_date,
    });
    if (!errors.isEmpty()) {
      res.render('layout', {
        contentFile: 'director_form',
        title: 'Create Director',
        director,
        to_date_yyyy_mm_dd,
        errors: errors.array(),
      });
      return;
    } else {
      await db.collection('directors').insertOne(director);
      res.redirect(director.getUrl());
    }
  }),
];

exports.director_delete_get = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const [rawDirector, rawAllMoviesByDirector] = await Promise.all([
    db.collection('directors').findOne({ _id: id }),
    db
      .collection('movies')
      .find({ 'director._id': id })
      .project({ title: 1, summary: 1, releaseYear: 1 })
      .sort({ title: 1 })
      .toArray(),
  ]);
  const director = Director(rawDirector);
  const allMoviesByDirector = rawAllMoviesByDirector.map((x) => Movie(x));

  if (!director) {
    res.redirect('catalogue/directors');
  }

  res.render('layout', {
    contentFile: 'director_delete',
    title: 'Delete Director',
    director,
    movies: allMoviesByDirector,
  });
});
exports.director_delete_post = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const [rawDirector, rawAllMoviesByDirector] = await Promise.all([
    db.collection('directors').findOne({ _id: id }),
    db
      .collection('movies')
      .find({ 'director._id': id })
      .project({ title: 1, summary: 1, releaseYear: 1 })
      .sort({ title: 1 })
      .toArray(),
  ]);
  const director = Director(rawDirector);
  const allMoviesByDirector = rawAllMoviesByDirector.map((x) => Movie(x));

  if (allMoviesByDirector.length) {
    res.render('layout', {
      contentFile: 'director_delete',
      title: 'Delete Director',
      director,
      movies: allMoviesByDirector,
    });
  }

  await db
    .collection('directors')
    .deleteOne({ _id: new ObjectId(req.body.director_id) });
  res.redirect('/catalogue/directors');
});

exports.director_update_get = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const directorDoc = await db.collection('directors').findOne({ _id: id });
  if (!directorDoc) {
    debug(`ID not found: ${req.params.id}`);
    const err = new Error('Director not found');
    err.status = 404;
    return next(err);
  }
  const director = Director(directorDoc);
  res.render('layout', {
    contentFile: 'director_form',
    title: 'Update Director',
    director,
    to_date_yyyy_mm_dd,
  });
});
exports.director_update_post = [
  oneOf([body('first_name').notEmpty(), body('last_name').notEmpty()], {
    message: 'A first or last name must be provided',
  }),
  body('first_name').trim().escape(),
  body('last_name').trim().escape(),
  body('birth_date', 'Invalid date of birth')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('death_date', 'Invalid date of death')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const id = new ObjectId(req.params.id);
    const errors = validationResult(req);
    const director = Director({
      _id: id,
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      birthDate: req.body.birth_date,
      deathDate: req.body.death_date,
    });
    if (!errors.isEmpty()) {
      res.render('layout', {
        contentFile: 'director_form',
        title: 'Update Director',
        director,
        to_date_yyyy_mm_dd,
        errors: errors.array(),
      });
    } else {
      await db
        .collection('directors')
        .updateOne({ _id: id }, { $set: director });
      res.redirect(director.getUrl());
    }
  }),
];
