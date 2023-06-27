const _GenreSchema = ({ _id, name }) => {
  return { _id, name };
};

const Genre = (infoObject) => {
  if (!infoObject.name) {
    return { error: 'name_required' };
  }

  const newGenre = _GenreSchema(infoObject);

  newGenre.getUrl = () => `/catalogue/genre/${newGenre._id}`;

  return newGenre;
};

module.exports = Genre;
