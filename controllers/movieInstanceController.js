const { MovieInstance, FORMATS, STATUSES } = require('../models/movieInstance');
const Movie = require('../models/movie');
const { db, ObjectId } = require('../mongodb_config');
const { to_date_yyyy_mm_dd } = require('../controllers/date_utility');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.movieinstance_list = asyncHandler(async (req, res, next) => {
  const allInstancesRaw = await db
    .collection('movie_instances')
    .aggregate([
      {
        $lookup: {
          from: 'movies',
          localField: 'movie._id',
          foreignField: '_id',
          as: 'movie_info',
        },
      },
    ])
    .sort({ 'movie_info.title': 1 })
    .toArray();

  const allInstances = [];
  allInstancesRaw.forEach((rawInstance, index) => {
    const normalizedInstance = rawInstance;
    normalizedInstance.movie = Movie(normalizedInstance.movie_info[0]);
    allInstances.push(MovieInstance(normalizedInstance));
  });

  res.render('layout', {
    contentFile: 'movieinstance_list',
    title: 'Movie Instance List',
    movieinstances: allInstances,
  });
});

exports.movieinstance_detail = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const instanceDoc = await db
    .collection('movie_instances')
    .findOne({ _id: id });
  const instance = MovieInstance(instanceDoc);
  const movieDoc = await db
    .collection('movies')
    .findOne({ _id: instance.movie._id });
  const movie = Movie(movieDoc);

  res.render('layout', {
    contentFile: 'movieinstance_detail',
    title: 'Movie Copy',
    instance,
    movie,
  });
});

exports.movieinstance_create_get = asyncHandler(async (req, res, next) => {
  const allMovies = await db
    .collection('movies')
    .find({})
    .sort({ title: 1 })
    .toArray();

  res.render('layout', {
    contentFile: 'movieinstance_form',
    title: 'Create Movie Instance',
    movies: allMovies,
    formats: FORMATS,
    statuses: STATUSES,
  });
});
exports.movieinstance_create_post = [
  body('movie', 'Movie must be specified')
    .trim()
    .notEmpty()
    .escape()
    .customSanitizer((value) => new ObjectId(value)),
  body('status', 'Unrecognized status')
    .optional({ values: 'falsy' })
    .custom((value) => STATUSES.indexOf(value) !== -1)
    .escape(),
  body('edition').escape(),
  body('format')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Must select format')
    .custom((value) => FORMATS.indexOf(value) !== -1)
    .withMessage('Unrecognized format'),
  body('unavailable_date', 'Invalid unavailable date')
    .optional({ values: 'falsy' })
    .customSanitizer((value, { req }) =>
      req.body.status === STATUSES[0] ? '' : value
    )
    .isISO8601()
    .toDate(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const movieInstance = MovieInstance({
      movie: { _id: req.body.movie },
      format: req.body.format,
      edition: req.body.edition,
      status: req.body.status,
      statusChangeDate: req.body.unavailable_date,
    });

    if (!errors.isEmpty()) {
      const allMovies = await db
        .collection('movies')
        .find({})
        .sort({ title: 1 })
        .toArray();

      res.render('layout', {
        contentFile: 'movieinstance_form',
        title: 'Create Movie Instance',
        movies: allMovies,
        instance: movieInstance,
        formats: FORMATS,
        statuses: STATUSES,
        ObjectId,
        to_date_yyyy_mm_dd,
        errors: errors.array(),
      });
    } else {
      await db.collection('movie_instances').insertOne(movieInstance);
      res.redirect(movieInstance.getUrl());
    }
  }),
];

exports.movieinstance_delete_get = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const instanceDoc = await db
    .collection('movie_instances')
    .findOne({ _id: id });
  const instance = MovieInstance(instanceDoc);
  const movieDoc = await db
    .collection('movies')
    .findOne(
      { _id: instance.movie._id },
      { projection: { title: 1, releaseYear: 1 } }
    );
  const movie = Movie(movieDoc);

  res.render('layout', {
    contentFile: 'movieinstance_delete',
    title: 'Delete Copy',
    instance,
    movie,
  });
});
exports.movieinstance_delete_post = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);

  await db.collection('movie_instances').deleteOne({ _id: id });
  res.redirect('/catalogue/movieinstances');
});

exports.movieinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance update GET');
});
exports.movieinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance update POST');
});
