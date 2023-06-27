const MovieInstance = require('../models/movieInstance');
const asyncHandler = require('express-async-handler');

exports.movieinstance_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: MovieInstance list');
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
