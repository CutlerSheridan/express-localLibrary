const { DateTime } = require('luxon');

const to_date_yyyy_mm_dd = (jsDateObject) => {
  const dateString = DateTime.fromJSDate(jsDateObject, {
    zone: 'utc',
  }).toFormat('yyyy-MM-dd');
  return dateString;
};

module.exports = { to_date_yyyy_mm_dd };
