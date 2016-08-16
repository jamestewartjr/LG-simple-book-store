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

module.exports = {
  pgp: pgp,
  db: db,
  getAllBooks: getAllBooks,
  getAllBooksWithAuthors: getAllBooksWithAuthors,
  getBookById: getBookById
};
//
// db.any("select books.* from books", [true])
//   .then(function(data){
//     console.log("DATA:", data);
//   })
//   .catch(function (error){
//     console.log("ERROR:". error);
//   })
// .finally(function() {
//   pgp.end();
// });
