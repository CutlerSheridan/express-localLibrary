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
  // extend factory function to pass array as parameter
  if (infoObject.length) {
    return infoObject.map((ins) => MovieInstance(ins));
  }

  if (infoObject.status && STATUSES.indexOf(infoObject.status) === -1) {
    infoObject.status = STATUSES[0];
  }
  if (infoObject.status !== STATUSES[0] && !infoObject.statusChangeDate) {
    infoObject.statusChangeDate = Date.now();
  } else if (infoObject.status !== STATUSES[0] && infoObject.statusChangeDate) {
    infoObject.statusChangeDate = new Date(infoObject.statusChangeDate);
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

const FORMATS = [
  '4K',
  'Blu-Ray',
  'Digital',
  'DVD',
  'VHS',
  'Laserdisc',
  'Other',
];
const STATUSES = ['available', 'loaned', 'damaged'];

module.exports = { MovieInstance, FORMATS, STATUSES };
