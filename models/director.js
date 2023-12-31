const { DateTime } = require('luxon');

const _DirectorSchema = ({
  _id,
  firstName = '',
  lastName = '',
  birthDate,
  deathDate,
}) => {
  return {
    _id,
    firstName,
    lastName,
    birthDate,
    deathDate,
  };
};

const Director = (infoObject) => {
  if (infoObject.length) {
    return infoObject.map((dir) => Director(dir));
  }

  if (infoObject.birthDate) {
    infoObject.birthDate = new Date(infoObject.birthDate);
  }
  if (infoObject.deathDate) {
    infoObject.deathDate = new Date(infoObject.deathDate);
  }
  const directorObject = _DirectorSchema(infoObject);
  directorObject.firstName = normalizeNameLength(
    directorObject.firstName,
    1000
  );
  directorObject.lastName = normalizeNameLength(directorObject.lastName, 1000);

  directorObject.setFirstName = (newName) => {
    directorObject.firstName = normalizeNameLength(newName, 1000);
  };
  directorObject.setLastName = (newName) => {
    directorObject.lastName = normalizeNameLength(newName, 1000);
  };
  directorObject.getName = () => {
    let name = '';
    let first = directorObject.firstName;
    let last = directorObject.lastName;

    if (first === '' && last === '') {
      name = 'Unknown';
    } else if (first !== '' && last !== '') {
      name =
        normalizeNameLength(first, 40) + ' ' + normalizeNameLength(last, 40);
    } else {
      name = normalizeNameLength(first, 60) + normalizeNameLength(last, 60);
    }

    return name;
  };
  directorObject.getUrl = () => `/catalogue/director/${directorObject._id}`;
  directorObject.getLifeDates = () => {
    const birth = DateTime.fromJSDate(directorObject.birthDate).toLocaleString(
      DateTime.DATE_MED
    );
    const death = directorObject.deathDate
      ? DateTime.fromJSDate(directorObject.deathDate).toLocaleString(
          DateTime.DATE_MED
        )
      : '';
    return birth + ' - ' + death;
  };

  return directorObject;
};

const normalizeNameLength = (name, maxLength) => {
  let newName = name;
  if (name.length > maxLength) {
    newName = name.substring(0, maxLength) + '...';
  }
  return newName;
};

module.exports = Director;
