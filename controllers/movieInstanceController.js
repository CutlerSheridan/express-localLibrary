const MovieInstance = require('../models/movieInstance');
const Movie = require('../models/movie');
const { db } = require('../mongodb_config');

const asyncHandler = require('express-async-handler');

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
  res.send(`NOT IMPLEMENTED: MovieInstance detail: ${req.params.id}`);
});

exports.movieinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance create GET');
});
exports.movieinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance create POST');
});

exports.movieinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance delete GET');
});
exports.movieinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance delete POST');
});

exports.movieinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance update GET');
});
exports.movieinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance update POST');
});
