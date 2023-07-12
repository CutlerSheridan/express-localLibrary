const Movie = require('../models/movie');
const { MovieInstance } = require('../models/movieInstance');
const Director = require('../models/director');
const Genre = require('../models/genre');
const { db, ObjectId } = require('../mongodb_config');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
  const genres = genreDocs.length ? Genre(genreDocs) : [];
  const instances = instanceDocs.length ? MovieInstance(instanceDocs) : [];

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
  let [allDirectors, allGenres] = await Promise.all([
    db
      .collection('directors')
      .find({})
      .sort({ lastName: 1, firstName: 1 }, { collation: { strength: 1 } })
      .toArray(),
    db.collection('genres').find({}).sort({ name: 1 }).toArray(),
  ]);

  allDirectors = Director(allDirectors);
  allGenres = Genre(allGenres);
  res.render('layout', {
    contentFile: 'movie_form',
    title: 'Create Movie',
    directors: allDirectors,
    genres: allGenres,
  });
});
exports.movie_create_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (!req.body.genre) {
        req.body.genre = [];
      } else {
        req.body.genre = [req.body.genre];
      }
    }

    next();
  },
  (req, res, next) => {
    if (!(req.body.director instanceof Array)) {
      if (!req.body.director) {
        req.body.director = [];
      } else {
        req.body.director = [req.body.director];
      }
    }
    next();
  },
  body('title', 'Title must be specified').trim().isLength({ min: 1 }).escape(),
  body('director', 'Must include at least one director').isArray({ min: 1 }),
  body('director.*').escape(),
  body('summary', 'Summary must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('release_year')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Release year must be specified')
    .isLength({ min: 4, max: 4 })
    .withMessage('Release year must be four digits long'),
  body('genre.*').escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const movie = Movie({
      title: req.body.title,
      director: req.body.director.map((x) => {
        return { _id: new ObjectId(x) };
      }),
      releaseYear: +req.body.release_year,
      summary: req.body.summary || '',
      genre: req.body.genre.map((x) => {
        return { _id: new ObjectId(x) };
      }),
    });

    if (!errors.isEmpty()) {
      let [allDirectors, allGenres] = await Promise.all([
        db
          .collection('directors')
          .find({})
          .sort({ lastName: 1, firstName: 1 }, { collation: { strength: 1 } })
          .toArray(),
        db.collection('genres').find({}).sort({ name: 1 }).toArray(),
      ]);
      allDirectors = Director(allDirectors);
      allGenres = Genre(allGenres);
      for (const dir of allDirectors) {
        if (movie.director.findIndex((x) => x._id.equals(dir._id)) > -1) {
          dir.checked = true;
        }
      }
      // mark selected genres as checked
      for (const genre of allGenres) {
        if (movie.genre.findIndex((x) => x._id.equals(genre._id)) > -1) {
          genre.checked = true;
        }
      }
      res.render('layout', {
        contentFile: 'movie_form',
        title: 'Create Movie',
        directors: allDirectors,
        genres: allGenres,
        movie,
        ObjectId,
        errors: errors.array(),
      });
    } else {
      await db.collection('movies').insertOne(movie);
      res.redirect(movie.getUrl());
    }
  }),
];

exports.movie_delete_get = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const [movieDoc, instanceDocs] = await Promise.all([
    db.collection('movies').findOne({ _id: id }),
    db.collection('movie_instances').find({ 'movie._id': id }).toArray(),
  ]);
  const movie = Movie(movieDoc);
  const instances = MovieInstance(instanceDocs);

  res.render('layout', {
    contentFile: 'movie_delete',
    title: 'Delete Movie',
    movie,
    instances,
  });
});
exports.movie_delete_post = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.body.movie_id);
  const [movieDoc, instanceDocs] = await Promise.all([
    db.collection('movies').findOne({ _id: id }),
    db.collection('movie_instances').find({ 'movie._id': id }).toArray(),
  ]);
  const movie = Movie(movieDoc);
  const instances = MovieInstance(instanceDocs);

  if (instances.length) {
    res.render('layout', {
      contentFile: 'movie_delete',
      title: 'Delete Movie',
      movie,
      instances,
    });
  }
  await db.collection('movies').deleteOne({ _id: id });
  res.redirect('/catalogue/movies');
});

exports.movie_update_get = asyncHandler(async (req, res, next) => {
  const id = new ObjectId(req.params.id);
  const movieDoc = await db.collection('movies').findOne({ _id: id });
  const [directorDocs, genreDocs] = await Promise.all([
    db
      .collection('directors')
      .find({})
      .sort({ lastName: 1, firstName: 1 })
      .toArray(),
    db.collection('genres').find({}).sort({ name: 1 }).toArray(),
  ]);
  const [movie, directors, genres] = [
    Movie(movieDoc),
    Director(directorDocs),
    Genre(genreDocs),
  ];
  if (!movie) {
    const err = new Error('Movie not found');
    err.status = 404;
    return next(err);
  }
  for (const dir of directors) {
    if (movie.director.findIndex((x) => x._id.equals(dir._id)) > -1) {
      dir.checked = true;
    }
  }
  for (const genre of genres) {
    if (movie.genre.findIndex((x) => x._id.equals(genre._id)) > -1) {
      genre.checked = true;
    }
  }

  res.render('layout', {
    contentFile: 'movie_form',
    title: 'Update Movie',
    movie,
    directors,
    genres,
  });
});
exports.movie_update_post = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (!req.body.genre) {
        req.body.genre = [];
      } else {
        req.body.genre = [req.body.genre];
      }
    }

    next();
  },
  (req, res, next) => {
    if (!(req.body.director instanceof Array)) {
      if (!req.body.director) {
        req.body.director = [];
      } else {
        req.body.director = [req.body.director];
      }
    }
    next();
  },
  body('title', 'Title must be specified').trim().isLength({ min: 1 }).escape(),
  body('director', 'Must include at least one director').isArray({ min: 1 }),
  body('director.*').escape(),
  body('summary', 'Summary must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('release_year')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Release year must be specified')
    .isLength({ min: 4, max: 4 })
    .withMessage('Release year must be four digits long'),
  body('genre.*').escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const movie = Movie({
      _id: new ObjectId(req.params.id),
      title: req.body.title,
      director: req.body.director.map((x) => {
        return { _id: new ObjectId(x) };
      }),
      releaseYear: +req.body.release_year,
      summary: req.body.summary || '',
      genre: req.body.genre.map((x) => {
        return { _id: new ObjectId(x) };
      }),
    });

    if (!errors.isEmpty()) {
      let [allDirectors, allGenres] = await Promise.all([
        db
          .collection('directors')
          .find({})
          .sort({ lastName: 1, firstName: 1 }, { collation: { strength: 1 } })
          .toArray(),
        db.collection('genres').find({}).sort({ name: 1 }).toArray(),
      ]);
      allDirectors = Director(allDirectors);
      allGenres = Genre(allGenres);
      for (const dir of allDirectors) {
        if (movie.director.findIndex((x) => x._id.equals(dir._id)) > -1) {
          dir.checked = true;
        }
      }
      for (const genre of allGenres) {
        if (movie.genre.findIndex((x) => x._id.equals(genre._id)) > -1) {
          genre.checked = true;
        }
      }
      res.render('layout', {
        contentFile: 'movie_form',
        title: 'Create Movie',
        directors: allDirectors,
        genres: allGenres,
        movie,
        ObjectId,
        errors: errors.array(),
      });
    } else {
      await db
        .collection('movies')
        .updateOne({ _id: movie._id }, { $set: movie });
      res.redirect(movie.getUrl());
    }
  }),
];
