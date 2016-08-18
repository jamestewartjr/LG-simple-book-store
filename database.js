'use strict';

const pgp = require('pg-promise')();
const connectionString = `postgres://${process.env.USER}@localhost:5432/clammy-tayra`
const db = pgp(connectionString);

const getBookById = function(bookId){
  return db.one("select * from books where books.id=$1", [bookId])
}

const getAllBooks = function(id){
  return db.any("select * from books");
}

const getAllGenres = function(id){
  return db.any("select * from genres");
}

const getAllAuthors = function(id){
  return db.any("select * from authors");
}

const getAllBooksWithAuthors = function() {
  return getAllBooks().then(function(books){
    console.log('GOT BOOKS', books)
    const bookIds = books.map(book => book.id)
    const sql = `
      SELECT
        authors.*,
        author_books.book_id
      FROM
        authors
      JOIN
        author_books
      ON
        authors.id=author_books.author_id
      WHERE
        author_books.book_id IN ($1:csv)
    `;
    console.log('booksIds', bookIds)
    return db.any(sql, [bookIds])
      .then(function(authors) {
        books.forEach(book => {
          console.log('BOOK', book)
          book.authors = authors.filter(author => author.book_id === book.id);
        })
        return books
      })
      .catch(function(error){
        console.error(error)
        throw error;
      })
  })
}

const createAuthor = function(attributes){
  const sql = `
    INSERT INTO
      authors (name)
    VALUES
     ($1)
    RETURNING
      *
  `
  return db.one(sql, [attributes.name])
}

const createGenre = function(attributes){
  const sql = `
    INSERT INTO
      genres (title)
    VALUES
     ($1)
    RETURNING
      *
  `
  return db.one(sql, [attributes.title])
}

const createBook = function(attributes){
  const sql = `
    INSERT INTO
      books (title)
      books (description)
    VALUES
     ($1)
    RETURNING
      *
  `
  var queries = [
    db.one(sql, [attributes.title])
  ]
  attributes.authors.forEach(function(author){
    queries.push(createAuthor(author))
  })

  return Promise.all(queries)
    .then(function(authors){
      var book = authors.shift()
      return Promise.all([
        associateAuthorsWithBook(book.id, authors.map(a => a.id)),
        associateGenresWithBook(book.id, attributes.genres),
      ]).then(function(){
        return book;
      })
    })
}

const associateAuthorsWithBook = function(bookId, authorIds){
  const queries = authorIds.map(authorId => {
    let sql = `
      INSERT INTO
        author_books (author_id, book_id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [authorId, bookId])
  })
  return Promise.all(queries)
}

const associateGenresWithBook = function(bookId, genreIds){
  const queries = genreIds.map(genreId => {
    let sql = `
      INSERT INTO
        book_genres (genre_id, book_id)
      VALUES
        ($1, $2)
    `
    return db.none(sql, [genreId, bookId])
  })
  return Promise.all(queries)
}

const getAuthorsByBookId = function(bookId){
  const sql = `
    SELECT
      authors.*
    FROM
      authors
    JOIN
      author_books
    ON
      authors.id=author_books.author_id
    WHERE
      author_books.book_id=$1
  `
  return db.any(sql, [bookId])
}

const getGenresByBookId = function(bookId){
  const sql = `
    SELECT
      genres.*
    FROM
      genres
    JOIN
      book_genres
    ON
      genres.id=book_genres.genre_id
    WHERE
      book_genres.book_id=$1
  `
  return db.any(sql, [bookId])
}

const updateBookTitle = function(bookId, title){
  const sql = `
    UPDATE
      books
    SET
      title=$2
    WHERE
      books.id=$1
  `
  db.none(sql, [bookId, title])
}

const findOrCreateAuthor = function(attributes){
  return db.oneOrNone('SELECT * FROM authors WHERE authors.name=$1 LIMIT 1', [attributes.name])
    .then(author => {
      console.log('findOrCreateAuthor', author)
      if (author) return author;
      return createAuthor(attributes)
    });
}

const updateAuthorsForBook = function(bookId, authors){
  if (typeof authors === 'undefined') return;
  console.log('updating authors', bookId, authors)

  return db.none('DELETE FROM author_books WHERE book_id=$1', [bookId])
    .then(()=> {
      const findOrCreateAuthorsQueries = []
        authors.forEach(author => {
        if (author.name === '') return;
        findOrCreateAuthorsQueries.push(findOrCreateAuthor(author))
      })

      return Promise.all(findOrCreateAuthorsQueries).then(authors => {
        console.log('FOUND OR CREATED AUTHORS: ', authors)
        return associateAuthorsWithBook(bookId, authors.map(a => a.id))
      });
    })
}

const findOrCreateGenre = function(attributes){
  return db.oneOrNone('SELECT * FROM genres WHERE genres.title=$1 LIMIT 1', [attributes.title])
    .then(genre => {
      if (genre) return;
      return createGenre(attributes)
    });
}



const updateGenresForBook = function(bookId, genreIds){
  if (typeof genreIds === 'undefined') return
  console.log('updating genres', bookId, genreIds)

  return db.none('DELETE FROM book_genres WHERE book_id=$1', [bookId])
    .then(()=> {
      return associateGenresWithBook(bookId, genreIds)
    })
}


const updateBook = function(bookId, attributes){
  console.log('UPDATE BOOK', bookId, attributes)
  return Promise.all([
    updateBookTitle(bookId, attributes.title),
    updateAuthorsForBook(bookId, attributes.authors),
    updateGenresForBook(bookId, attributes.genres),
  ])

  // var queries = [
  //   db.one(sql, [attributes.title])
  // ]
  // attributes.authors.forEach(function(author){
  //   queries.push(createAuthor(author))
  // })
  //
  // return Promise.all(queries)
  //   .then(function(authors){
  //     var book = authors.shift()
  //     return Promise.all([
  //       associateAuthorsWithBook(book.id, authors.map(a => a.id)),
  //       associateGenresWithBook(book.id, attributes.genres),
  //     ]).then(function(){
  //       return book;
  //     })
  //   })
}


const getBookWithAuthorsAndGenresByBookId = function(bookId){
  return Promise.all([
    getBookById(bookId),
    getAuthorsByBookId(bookId),
    getGenresByBookId(bookId)
  ])
    .then(function(results){
      const book = results[0];
      book.authors = results[1];
      book.genres = results[2];
      return book;
    })
}

const searchForBooks = function(options){
  const variables = []
  let sql = `
    SELECT
      DISTINCT(books.*)
    FROM
      books
  `
  if (options.search_query){
    let search_query = options.search_query
      .toLowerCase()
      .replace(/^ */, '%')
      .replace(/ *$/, '%')
      .replace(/ +/g, '%')

    variables.push(search_query)
    sql += `
        WHERE
      LOWER(books.title) LIKE $${variables.length}
    `
  }
  console.log('----->', sql, variables)
  return db.any(sql, variables)
}

const searchForBook = searchTerm => {
   const sql = `
     SELECT
       DISTINCT(books.*)
     FROM
       books
     JOIN
       book_author
     ON
       authors.id=book_author.author_id
     JOIN
       books
     ON
       book_author.book_id=books.id
     WHERE
       authors.author LIKE '$1%';
   `
   return db.any(sql, [searchTerm])
 }

 const searchForAuthor = searchTerm => {
   const sql = `
     SELECT
       DISTINCT(authors.*)
     FROM
       authors
     JOIN
       book_author
     ON
       books.id=book_author.book_id
     JOIN
       authors
     ON
       book_author.author_id=authors.id
     WHERE
       authors.author LIKE '$1%';
   `
   return db.any(sql, [searchTerm])
 }

module.exports = {
  pgp: pgp,
  db: db,
  getAllBooks: getAllBooks,
  getAllBooksWithAuthors: getAllBooksWithAuthors,
  getBookWithAuthorsAndGenresByBookId: getBookWithAuthorsAndGenresByBookId,
  getBookById: getBookById,
  createBook: createBook,
  getAllGenres: getAllGenres,
  getAuthorsByBookId: getAuthorsByBookId,
  searchForBooks:searchForBooks,
  searchForBook:searchForBook,
  searchForAuthor:searchForAuthor,
  updateBook: updateBook,
};
