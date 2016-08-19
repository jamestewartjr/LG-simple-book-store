-- schema
DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title varchar(255) NOT NULL,
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  title varchar(255) NOT NULL
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres (
  book_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name varchar(255) NOT NULL
);

DROP TABLE IF EXISTS author_books;

CREATE TABLE author_books (
  author_id INTEGER NOT NULL,
  book_id INTEGER NOT NULL
);


SELECT now();

-- fixture data
INSERT INTO
  books (title)
VALUES
  ('Trekonomics'),
  ('White Fang'),
  ('Lord of the Rings I'),
  ('Lord of the Rings II'),
  ('Lord of the Rings III'),
  ('Clueless');

INSERT INTO
  genres (title)
VALUES
  ('Fantasy'),
  ('Horror'),
  ('SciFi'),
  ('Adult'),
  ('Children'),
  ('Teen');

INSERT INTO
  authors (name)
VALUES
  ('Manu Saadia'),
  ('Jack London'),
  ('J.R.R. Tolkien'),
  ('Alicia Silverstone');

INSERT INTO
  author_books
SELECT
  authors.id, books.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'White Fang'
AND
  authors.name = 'Jack London';


INSERT INTO
  author_books
SELECT
  authors.id, books.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'Trekonomics'
AND
  authors.name = 'Manu Saadia';

INSERT INTO
  author_books
SELECT
  authors.id, books.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title LIKE 'Lord of the Rings%'
AND
  authors.name = 'J.R.R. Tolkien';

INSERT INTO
  book_genres
SELECT
  books.id, genres.id
FROM
  books
CROSS JOIN
  genres
WHERE
  books.title = 'White Fang'
AND
  genres.title = 'Fantasy';


INSERT INTO
  book_genres
SELECT
  books.id, genres.id
FROM
  books
CROSS JOIN
  genres
WHERE
  books.title = 'White Fang'
AND
  genres.title = 'Teen';


INSERT INTO
  book_genres
SELECT
  books.id, genres.id
FROM
  books
CROSS JOIN
  genres
WHERE
  books.title = 'Lord of the Rings I'
AND
  genres.title = 'Fantasy';

INSERT INTO
  book_genres
SELECT
  books.id, genres.id
FROM
  books
CROSS JOIN
  genres
WHERE
  books.title = 'Lord of the Rings II'
AND
  genres.title = 'Fantasy';


INSERT INTO
  book_genres
SELECT
  books.id, genres.id
FROM
  books
CROSS JOIN
  genres
WHERE
  books.title = 'Clueless'
AND
  genres.title = 'Teen';

SELECT now();

SELECT * FROM author_books;



-- Users can search for books by title OR by author OR by genre, and search results will be presented in a new page

-- give me all the books where the title is LIKE x
SELECT * FROM books WHERE title LIKE '%something%';

-- give me all the books in the genre X
SELECT
  books.*
FROM
  books
LEFT JOIN
  book_genres
ON
  books.id = book_genres.book_id
LEFT JOIN
  genres
ON
  genres.id = book_genres.genre_id
WHERE
  genres.title = 'Fantasy';

-- give me all the books authored by X


SELECT
  books.*
FROM
  books
JOIN
  author_books
ON
  books.id = author_books.book_id
JOIN
  authors
ON
  authors.id = author_books.author_id
WHERE
  authors.name = 'J.R.R. Tolkien';




-- Users can view book details on a book detail page, linked to from the listing or search pages
