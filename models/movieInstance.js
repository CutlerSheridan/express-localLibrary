const { DateTime } = require('luxon');

const _MovieInstanceSchema = ({
  _id, // assigned by MongoDB
  movie, // required reference to movieId
  format, // 4K, Blu-Ray, Digital, DVD, VHS, Laserdisc, Other
  edition = null,
  status = 'available', // available, loaned, reserved, damaged
  statusChangeDate = null,
}) => {
  return {
    _id,
    movie,
    format,
    edition,
    status,
    statusChangeDate,
  };
};

const MovieInstance = (infoObject) => {
  if (infoObject.length) {
    return infoObject.map((ins) => MovieInstance(ins));
  }

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
  if (
    infoObject.status &&
    infoObject.status !== _statuses[0] &&
    !infoObject.statusChangeDate
  ) {
    infoObject.statusChangeDate = Date.now();
  }

  const newMovieInstance = _MovieInstanceSchema(infoObject);

  newMovieInstance.getUrl = () =>
    `/catalogue/movieinstance/${newMovieInstance._id}`;
  newMovieInstance.formatStatusChangeDate = () => {
    if (newMovieInstance.statusChangeDate) {
      return DateTime.fromJSDate(
        newMovieInstance.statusChangeDate
      ).toLocaleString(DateTime.DATE_FULL);
    }
    return '(No date to format)';
  };

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
const _statuses = ['available', 'loaned', 'damaged'];

module.exports = MovieInstance;
