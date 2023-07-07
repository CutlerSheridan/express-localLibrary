# Express Local Library Tutorial

## A movie library built using Express and MongoDB

View movies in your collection, how many copies of each and in which formats, which are available or not, directors, and genres.

#### TODO NEXT

#### TODO LATER

- create MongoDB indices:
  - movies: genre.\_id
  - ? movie_instances: $lookup movies.\_id from movie.\_id
  - movie_instance: movie.\_id
  - genres: name, case insensitive w/ collation of 2 (1 would also ignore diacritics) - determine if this is necessary as it's only used when creating and people are more forgiving of that; if created, remove regex field value from genreController and add .collation() parameters

##### Features

##### Behavior

##### Style

- add credit

#### DONE

_0.2.0_

- write genre_form logic with validation and sanitization
- write genre_form template
- write director_form logic
- write director_form template
- add Director method to provide short, formatted dates for birth and death for form value syntax agreement

_0.1.5_

- write movieinstance_detail logic
- write movieinstance_detail template

_0.1.4_

- write director_detail logic
- write director_detail template

_0.1.3_

- write genre_detail logic
- write genre_detail template
- write movie_detail logic
- write movie_detail template
- add some unavailable movies to populatedb.js

_0.1.2_

- write author list logic
- write author list template
- write genre list logic
- write genre list template

_0.1.1_

- write movie instance list logic
- write movie instance list template
- adjust formatting of movie list and movie instance list

_0.1.0_

- write logic to display all movies
- write template to display all movies
- add movie with two directors to make sure their names display correctly

_0.0.0_

- add all controller files
- add layout.ejs and index.ejs
- add catalogue router
- add .env for API key
- add MongoDB config file
- write logic for home page display
- write templatae for home page display
- Initial commit
