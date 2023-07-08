const _MovieSchema = ({
  _id,
  title,
  director, // required array of objects with name and directorId props
  releaseYear,
  summary = '',
  genre = [], // optional array of objects with genreId and genreName
}) => {
  return {
    _id,
    title,
    director,
    releaseYear,
    summary,
    genre,
  };
};

const Movie = (infoObject) => {
  let errors = [];
  if (!infoObject.director) {
    errors.push({ error: 'director_required' });
  }
  if (errors.length > 0) {
    return errors;
  }

  const movieObject = _MovieSchema(infoObject);

  movieObject.getUrl = () => `/catalogue/movie/${movieObject._id}`;

  return movieObject;
};

module.exports = Movie;
