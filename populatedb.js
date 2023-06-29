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
  { watched, genre, collection, summary } = {}
) => {
  const movie = Movie({
    title,
    director,
    releaseYear,
    watched,
    genre,
    collection,
    summary,
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
  await movieCreate('The Piano', [directors[4]], 1993, {
    genre: [genres[1]],
    summary: `After a long voyage from Scotland, pianist Ada McGrath and her young daughter, Flora, are left with all their belongings, including a piano, on a New Zealand beach. Ada, who has been mute since childhood, has been sold into marriage to a local man named Alisdair Stewart. Making little attempt to warm up to Alisdair, Ada soon becomes intrigued by his Maori-friendly acquaintance, George Baines, leading to tense, life-altering conflicts.`,
  });
  await movieCreate('There Will Be Blood', [directors[0]], 2007, {
    watched: true,
    genre: [genres[1]],
    summary: `Ruthless silver miner, turned oil prospector, Daniel Plainview moves to oil-rich California. Using his son to project a trustworthy, family-man image, Plainview cons local landowners into selling him their valuable properties for a pittance. However, local preacher Eli Sunday suspects Plainview’s motives and intentions, starting a slow-burning feud that threatens both their lives.`,
  });
  await movieCreate('Phantom Thread', [directors[0]], 2017, {
    watched: true,
    genre: [genres[1], genres[2]],
    summary: `Renowned British dressmaker Reynolds Woodcock comes across Alma, a young, strong-willed woman, who soon becomes a fixture in his life as his muse and lover.`,
  });
  await movieCreate('West Side Story', [directors[2]], 2021, {
    genre: [genres[3], genres[1]],
    watched: true,
    summary: `Two youngsters from rival New York City gangs fall in love, but tensions between their respective friends build toward tragedy.`,
  });
  await movieCreate('Blade Runner', [directors[3]], 1982, {
    watched: true,
    genre: [genres[4], genres[1]],
    summary: `In the smog-choked dystopian Los Angeles of 2019, blade runner Rick Deckard is called out of retirement to terminate a quartet of replicants who have escaped to Earth seeking their creator for a way to extend their short life spans.`,
  });
  await movieCreate('Alien', [directors[3]], 1979, {
    watched: true,
    genre: [genres[4], genres[0]],
    summary: `During its return to the earth, commercial spaceship Nostromo intercepts a distress signal from a distant planet. When a three-member team of the crew discovers a chamber containing thousands of eggs on the planet, a creature inside one of the eggs attacks an explorer. The entire crew is unaware of the impending nightmare set to descend upon them when the alien parasite planted inside its unfortunate host is birthed.`,
  });
  await movieCreate('The Fog', [directors[1]], 1980, {
    watched: true,
    genre: [genres[0]],
    summary: `Strange things begin to occurs as a tiny California coastal town prepares to commemorate its centenary. Inanimate objects spring eerily to life; Rev. Malone stumbles upon a dark secret about the town’s founding; radio announcer Stevie witnesses a mystical fire; and hitchhiker Elizabeth discovers the mutilated corpse of a fisherman. Then a mysterious iridescent fog descends upon the village, and more people start to die.`,
  });
  await movieCreate('Halloween', [directors[1]], 1978, {
    watched: true,
    genre: [genres[0]],
    summary: `Fifteen years after murdering his sister on Halloween Night 1963, Michael Myers escapes from a mental hospital and returns to the small town of Haddonfield, Illinois to kill again.`,
  });
  await movieCreate('The Color Purple', [directors[2]], 1985, {
    genre: [genres[1]],
    summary: `An epic tale spanning forty years in the life of Celie, an African-American woman living in the South who survives incredible abuse and bigotry. After Celie’s abusive father marries her off to the equally debasing “Mister” Albert Johnson, things go from bad to worse, leaving Celie to find companionship anywhere she can. She perseveres, holding on to her dream of one day being reunited with her sister in Africa. Based on the novel by Alice Walker.`,
  });
  await movieCreate('Burn After Reading', [directors[5], directors[6]], 2008, {
    genre: [genres[2]],
    summary: `When a disc containing memoirs of a former CIA analyst falls into the hands of gym employees, Linda and Chad, they see a chance to make enough money for Linda to have life-changing cosmetic surgery. Predictably, events whirl out of control for the duo, and those in their orbit.`,
  });
};
const createMovieInstances = async () => {
  console.log('Adding movie instances');
  await Promise.all([
    movieInstanceCreate(movies[0], '4K'),
    movieInstanceCreate(movies[1], 'Blu-Ray'),
    movieInstanceCreate(movies[2], '4K', { status: 'damaged' }),
    movieInstanceCreate(movies[3], '4K', { status: 'loaned' }),
    movieInstanceCreate(movies[4], '4K'),
    movieInstanceCreate(movies[5], '4K', { status: 'loaned' }),
    movieInstanceCreate(movies[5], 'Blu-Ray'),
    movieInstanceCreate(movies[6], '4K'),
    movieInstanceCreate(movies[7], '4K'),
    movieInstanceCreate(movies[8], 'Blu-Ray'),
    movieInstanceCreate(movies[9], 'Blu-Ray'),
  ]);
};
