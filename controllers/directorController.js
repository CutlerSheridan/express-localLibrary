const Director = require('../models/director');
const asyncHandler = require('express-async-handler');

exports.director_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Director list');
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
