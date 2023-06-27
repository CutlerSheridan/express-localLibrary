#! /usr/bin/env node

// console.log(
//   'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
// );

// should create<model>() methods only push id and name to global arrays?

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Movie = require('./models/movie');
const Director = require('./models/director');
const MovieInstance = require('./models/movieInstance');
const Genre = require('./models/genre');

const genres = [];
const directors = [];
const movies = [];
const movieInstances = [];

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = userArgs[0];

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const db = client.db('local_library');

const main = async () => {
  try {
    console.log('Debug: About to connect');
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    await createGenres();
    await createDirectors();
    await createMovies();
    await createMovieInstances();
    console.log('Debug: Closing MongoDB');
  } finally {
    await client.close();
  }
};
main().catch((err) => console.log(err));

const genreCreate = async (name) => {
  const genre = Genre({ name });
  if (genre.error) {
    throw new error(genre.error);
  }
  const returnObject = await db.collection('genres').insertOne(genre);
  genre._id = returnObject.insertedId;
  genres.push(genre);
  console.log(`Added genre: ${name}`);
};
const directorCreate = async (firstName, lastName, birthDate, deathDate) => {
  const director = Director({ firstName, lastName, birthDate, deathDate });
  const returnObject = await db.collection('directors').insertOne(director);
  director._id = returnObject.insertedId;
  directors.push(director);
  console.log(`Added director: ${director.getName()}`);
};
const movieCreate = async (
  title,
  director,
  releaseYear,
  { watched, genre, collection } = {}
) => {
  const movie = Movie({
    title,
    director,
    releaseYear,
    watched,
    genre,
    collection,
  });
  if (genre.error) {
    throw new error(genre.error);
  }
  const returnObject = await db.collection('movies').insertOne(movie);
  movie._id = returnObject.insertedId;
  movies.push(movie);
  console.log(`Added movie: ${movie.title} (${movie.releaseYear})`);
};
const movieInstanceCreate = async (movie, format, { edition, status } = {}) => {
  const instance = MovieInstance({ movie, format, edition, status });
  if (instance.error) {
    throw new error(instance.error);
  }
  const returnObject = await db
    .collection('movie_instances')
    .insertOne(instance);
  instance._id = returnObject.insertedId;
  movieInstances.push(instance);
  console.log(`Added movie instance: ${instance.format}`);
};

const createGenres = async () => {
  console.log('Adding genres');
  await genreCreate('Horror');
  await genreCreate('Drama');
  await genreCreate('Comedy');
  await genreCreate('Musical');
  await genreCreate('Science Fiction');
};
const createDirectors = async () => {
  console.log('Adding directors');
  await directorCreate('Paul Thomas', 'Anderson', '1970-06-26');
  await directorCreate('John', 'Carpenter', '1948-01-16');
  await directorCreate('Steven', 'Spielberg', '1946-12-18');
  await directorCreate('Ridley', 'Scott', '1937-11-30');
  await directorCreate('Jane', 'Campion', '1954-04-30');
  await directorCreate('Ethan', 'Coen', '1957-09-21');
  await directorCreate('Joel', 'Coen', '1954-11-29');
};
const createMovies = async () => {
  console.log('Adding movies');
  await movieCreate('The Piano', [directors[4]], 1993, { genre: [genres[1]] });
  await movieCreate('There Will Be Blood', [directors[0]], 2007, {
    watched: true,
    genre: [genres[1]],
  });
  await movieCreate('Phantom Thread', [directors[0]], 2017, {
    watched: true,
    genre: [genres[1], genres[2]],
  });
  await movieCreate('West Side Story', [directors[2]], 2021, {
    genre: [genres[3], genres[1]],
    watched: true,
  });
  await movieCreate('Blade Runner', [directors[3]], 1982, {
    watched: true,
    genre: [genres[4], genres[1]],
  });
  await movieCreate('Alien', [directors[3]], 1979, {
    watched: true,
    genre: [genres[4], genres[0]],
  });
  await movieCreate('The Fog', [directors[1]], 1980, {
    watched: true,
    genre: [genres[0]],
  });
  await movieCreate('Halloween', [directors[1]], 1978, {
    watched: true,
    genre: [genres[0]],
  });
  await movieCreate('The Color Purple', [directors[2]], 1985, {
    genre: [genres[1]],
  });
  await movieCreate('Burn After Reading', [directors[5], directors[6]], 2008, {
    genre: [genres[2]],
  });
};
const createMovieInstances = async () => {
  console.log('Adding movie instances');
  await Promise.all([
    movieInstanceCreate(movies[0], '4K'),
    movieInstanceCreate(movies[1], 'Blu-Ray'),
    movieInstanceCreate(movies[2], '4K'),
    movieInstanceCreate(movies[3], '4K'),
    movieInstanceCreate(movies[4], '4K'),
    movieInstanceCreate(movies[5], '4K'),
    movieInstanceCreate(movies[5], 'Blu-Ray'),
    movieInstanceCreate(movies[6], '4K'),
    movieInstanceCreate(movies[7], '4K'),
    movieInstanceCreate(movies[8], 'Blu-Ray'),
    movieInstanceCreate(movies[9], 'Blu-Ray'),
  ]);
};
