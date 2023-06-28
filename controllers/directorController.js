const Director = require('../models/director');
const { db } = require('../mongodb_config');

const asyncHandler = require('express-async-handler');

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
  res.send(`NOT IMPLEMENTED: Director detail: ${req.params.id}`);
});

exports.director_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Director create GET');
});
exports.director_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Director create POST');
});

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
