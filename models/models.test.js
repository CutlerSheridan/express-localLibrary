const Director = require('./director.js');
const Movie = require('./movie.js');
const MovieInstance = require('./movieInstance.js');
const Genre = require('./genre.js');

describe('director', () => {
  describe('name functions', () => {
    test('getName works', () => {
      const newDirector = Director({
        _id: 'ljsfjfoi$#$gfWFWFgGw',
        firstName: 'Allison',
        lastName: 'Cooper',
        birthDate: '1965',
        deathDate: '2022',
      });

      expect(newDirector.getName()).toBe('Allison Cooper');
    });
    test('normalizes firstName display length', () => {
      const newDirector = Director({
        _id: 'ljsfjfoi$#$gfWFWFgGw',
        firstName:
          '1234567890 2234567890 3234567890 4234567890 5234567890 6234567890 7234567890 8234567890 9234567890 0234567890 1234567890',
        lastName: 'Cooper',
        birthDate: '1965',
        deathDate: '2022',
      });

      expect(newDirector.getName()).toHaveLength(
        40 + 3 + 1 + newDirector.lastName.length
      );
    });
    test('normalizes lastName display length', () => {
      const newDirector = Director({
        _id: 'ljsfjfoi$#$gfWFWFgGw',
        firstName: 'Allison',
        lastName:
          '1234567890 2234567890 3234567890 4234567890 5234567890 6234567890 7234567890 8234567890 9234567890 0234567890 1234567890',
        birthDate: '1965',
        deathDate: '2022',
      });

      expect(newDirector.getName()).toHaveLength(
        40 + 3 + 1 + newDirector.firstName.length
      );
    });
    test('normalizes name display length when only one name', () => {
      const newDirector = Director({
        _id: 'ljsfjfoi$#$gfWFWFgGw',
        lastName:
          '1234567890 2234567890 3234567890 4234567890 5234567890 6234567890 7234567890 8234567890 9234567890 0234567890 1234567890',
        birthDate: '1965',
        deathDate: '2022',
      });

      expect(newDirector.getName()).toHaveLength(
        60 + 3 + newDirector.firstName.length
      );
    });
    test('sets first name', () => {
      const newDirector = Director({
        _id: 'ljsfjfoi$#$gfWFWFgGw',
        firstName: 'Allison',
        lastName: 'Cooper',
        birthDate: '1965',
        deathDate: '2022',
      });

      newDirector.setFirstName('Michelle');

      expect(newDirector.firstName).toBe('Michelle');
    });
    test('sets last name', () => {
      const newDirector = Director({
        _id: 'ljsfjfoi$#$gfWFWFgGw',
        firstName: 'Allison',
        lastName: 'Cooper',
        birthDate: '1965',
        deathDate: '2022',
      });

      newDirector.setLastName('Tartt');

      expect(newDirector.lastName).toBe('Tartt');
    });
  });
  describe('getUrl', () => {
    test('constructs correct URL string', () => {
      const newDirector = Director({
        _id: 'ljsfjfoi$#$gfWFWFgGw',
        firstName: 'Allison',
        lastName: 'Cooper',
        birthDate: '1965',
        deathDate: '2022',
      });

      expect(newDirector.getUrl()).toBe(
        '/catalogue/director/ljsfjfoi$#$gfWFWFgGw'
      );
    });
  });
});

describe('movie', () => {
  describe('validation', () => {
    test('returns error if no director', () => {
      const newMovie = Movie({
        _id: 's;jfFSEAekjs',
        title: 'The Piano',
      });

      expect(newMovie).toHaveProperty('error', 'director_required');
    });
  });
  describe('getUrl', () => {
    test('constructs correct URL string', () => {
      const newMovie = Movie({
        _id: 's;jfFSEAekjs',
        title: 'The Piano',
        director: [{ name: 'Jane Campion', directorId: 'fojsjdle@$224dDD' }],
      });

      expect(newMovie.getUrl()).toBe('/catalogue/movie/s;jfFSEAekjs');
    });
  });
});

describe('movieInstance', () => {
  describe('validation', () => {
    test('rejects if no movieId', () => {
      const newInstance = MovieInstance({
        edition: '1995',
      });

      expect(newInstance).toHaveProperty('error', 'movieId_required');
    });
    test('rejects if format is passed but unrecognized', () => {
      const newInstance = MovieInstance({
        movie: 'fjlks2424SFSGggsSG',
        format: 'script',
      });

      expect(newInstance).toHaveProperty('error', 'unrecognized_format');
    });
    test('rejects if status is passed but unrecognized', () => {
      const newInstance = MovieInstance({
        movie: 'fjlks2424SFSGggsSG',
        status: 'big',
      });

      expect(newInstance).toHaveProperty('error', 'unrecognized_status');
    });
  });
  describe('getUrl', () => {
    test('constructs correct URL string', () => {
      const newInstance = MovieInstance({
        _id: 'lajksdflfkjFASDF234',
        movie: 'fjlks2424SFSGggsSG',
        format: '4K',
      });

      expect(newInstance.getUrl()).toBe(
        '/catalogue/movieinstance/lajksdflfkjFASDF234'
      );
    });
  });
});

describe('genre', () => {
  describe('validation', () => {
    test('returns error if no name', () => {
      const newGenre = Genre({});

      expect(newGenre).toHaveProperty('error', 'name_required');
    });
  });
  describe('getUrl', () => {
    test('constructs correct URL string', () => {
      const newGenre = Genre({
        _id: 's;jfFSEAekjs',
        name: 'horror',
      });

      expect(newGenre.getUrl()).toBe('/catalogue/genre/s;jfFSEAekjs');
    });
  });
});
