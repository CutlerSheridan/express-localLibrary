const Movie = require('../models/movie');
const MovieInstance = require('../models/movieInstance');
const Director = require('../models/director');
const Genre = require('../models/genre');
const { db, ObjectId } = require('../mongodb_config');

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
  const allMoviesRaw = await db
    .collection('movies')
    .aggregate([
      {
        $lookup: {
          from: 'directors',
          localField: 'director._id',
          foreignField: '_id',
          as: 'director_info',
        },
      },
    ])
    .sort({ title: 1 })
    .toArray();
  const allMovies = [];
  allMoviesRaw.forEach((rawMovie) => {
    const normalizedMovie = rawMovie;
    normalizedMovie.director = [];
    for (let dir of rawMovie.director_info) {
      normalizedMovie.director.push(Director(dir));
    }
    allMovies.push(Movie(normalizedMovie));
  });
  res.render('layout', {
    contentFile: 'movie_list',
    title: 'All movies',
    movies: allMovies,
  });
});

exports.movie_detail = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const movieDoc = await db.collection('movies').findOne({ _id: id });
  if (movieDoc === 'null') {
    const err = new Error('Book not found');
    err.status = 404;
    return next(err);
  }
  const movie = Movie(movieDoc);
  const [directorDocs, genreDocs, instanceDocs] = await Promise.all([
    db
      .collection('directors')
      .find({ _id: { $in: movie.director.map((x) => x._id) } })
      .sort({ lastName: 1, firstName: 1 })
      .toArray(),
    db
      .collection('genres')
      .find({ _id: { $in: movie.genre.map((x) => x._id) } })
      .sort({ name: 1 })
      .toArray(),
    db
      .collection('movie_instances')
      .find({ 'movie._id': id })
      .sort({ format: 1 })
      .toArray(),
  ]);
  const directors = Director(directorDocs);
  const genres = Genre(genreDocs);
  const instances = MovieInstance(instanceDocs);
  console.log(instances);

  res.render('layout', {
    contentFile: 'movie_detail',
    title: movie.title,
    movie,
    directors,
    genres,
    instances,
  });
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
