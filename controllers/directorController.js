const Director = require('../models/director');
const Movie = require('../models/movie');
const { db, ObjectId } = require('../mongodb_config');
const asyncHandler = require('express-async-handler');
const { body, validationResult, oneOf } = require('express-validator');

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
  res.send('NOT IMPLEMENTED: Director delete GET');
});
exports.director_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Director delete POST');
});

exports.director_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Director update GET');
});
exports.director_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Director update POST');
});
