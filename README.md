# Express Local Library

## A movie library built using Express and MongoDB

View movies in your collection, how many copies of each and in which formats, which are available or not, directors, and genres. Update them, delete them, add new ones.

#### TODO NEXT

#### TODO LATER

- add existing director check to director create form
- create MongoDB indices:
  - movies: genre.\_id for genre_detail and genre_delete
  - ? movie_instances: $lookup movies.\_id from movie.\_id
  - movie_instance: by movie.\_id for movie_detail and movie_delete
  - genres: name, case insensitive w/ collation of 2 (1 would also ignore diacritics) - determine if this is necessary as it's only used when creating and people are more forgiving of that; if created, remove regex field value from genreController and add .collation() parameters
  - movies: case insensitve by title for movieinstance_create_get and \_post
  - movies: by director.\_id for director_delete_get

##### Features

##### Behavior

##### Style

- add credit

#### DONE

_1.0.0_

- add dependencies for production environment

_0.4.3_

- implemenet director_update

_0.4.2_

- implement movieinstance_update

_0.4.1_

- implement genre_update

_0.4.0_

- refactor director_form to use checkboxes for director so multiple can be selected
- fix ObjectId agreement movie_create_post for director and genre checkbox indicators
- implement movie_update

_0.3.3_

- add "Go back" link to all delete screens when delete is not an option
- implememt genre_delete

_0.3.2_

- implement movie_delete

_0.3.1_

- fix instance list links to go to instance details pages
- implement movieinstance_delete

_0.3.0_

- implement director_delete

_0.2.5_

- write movieinstance_form template
- retain selected values upon incomplete form submission
- refactor instance.movie assignment to be compatible with other entries by making it an object with an \_id prop instead of just the id (since I idiotically had all object references include all data in objects instead of just referencing the IDs for lookup)

_0.2.4_

- extract date formatting logic converting dates to yyyy-MM-dd from Director into new date_utitily library

_0.2.3_

- write movieinstance_form logic
- refactor MovieInstance export as object so global variables can be shared
- refactor directorController logic so validation checks that at least one name is given (first or last) instead of requiring both
- add custom validators to movieinstance status and format to check if they're acceptable
- add custom sanitizer to movieinstance movie to convert it to MongoDB ObjectId

_0.2.2_

- add genres to movie_form logic
- add genres to movie_form template
- fix type agreement when validation flattens object arrays into string arrays with genre and director
- retain selected directors upon movie_form error
- retain selected genres upon movie_form error
- alter constructors for movie so validation happens with express-validator instead
- in movie creation, cast director \_id prop to ObjectId type
- fix movie_detail logic so movieinstances and genres don't return errors if empty
- add empty text for instances in movie_detail template
- fix typo in movie_detail template

_0.2.1_

- write movie_create logic for title, director, year, summary
- write template for same

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
