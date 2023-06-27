const _MovieSchema = ({
  _id,
  title,
  director, // required array of objects with name and directorId props
  releaseYear,
  watched = false,
  genre = [], // optional array of objects with genreId and genreName
  collection = [], // optional array of objects with collectionId and collectionName
}) => {
  return {
    _id,
    title,
    director,
    releaseYear,
    genre,
    collection,
    watched,
  };
};

const Movie = (infoObject) => {
  if (!infoObject.director) {
    return { error: 'director_required' };
  }
  if (!infoObject.releaseYear) {
    return { error: 'releaseYear_required' };
  }

  const movieObject = _MovieSchema(infoObject);

  movieObject.getUrl = () => `/catalogue/movie/${movieObject._id}`;

  return movieObject;
};

module.exports = Movie;
