const _MovieInstanceSchema = ({
  _id, // assigned by MongoDB
  movie, // required reference to movieId
  format, // 4K, Blu-Ray, Digital, DVD, VHS, Laserdisc, Other
  edition = null,
  status = 'available', // available, loaned, reserved, damaged
}) => {
  return {
    _id,
    movie,
    format,
    edition,
    status,
  };
};

const MovieInstance = (infoObject) => {
  if (!infoObject.movie) {
    return { error: 'movieId_required' };
  }
  if (!infoObject.format) {
    return { error: 'format_required' };
  }
  if (infoObject.format && _formats.indexOf(infoObject.format) === -1) {
    return { error: 'unrecognized_format' };
  }
  if (infoObject.status && _statuses.indexOf(infoObject.status) === -1) {
    return { error: 'unrecognized_status' };
  }

  const newMovieInstance = _MovieInstanceSchema(infoObject);

  newMovieInstance.getUrl = () =>
    `/catalogue/movieinstance/${newMovieInstance._id}`;

  return newMovieInstance;
};

const _formats = [
  '4K',
  'Blu-Ray',
  'Digital',
  'DVD',
  'VHS',
  'Laserdisc',
  'Other',
];
const _statuses = ['available', 'loaned', 'reserved', 'damaged'];

module.exports = MovieInstance;
