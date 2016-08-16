'use strict';

const pgp = require('pg-promise')();
const connectionString = `postgres://${process.env.USER}@localhost:5432/clammy-tayra`
const db = pgp(connectionString);

const getBookById = function(bookId){
  return db.one("select * from books where books.id=$1", [bookId])  
}

module.exports = {
  pgp: pgp,
  db: db,
  getBookById: getBookById,
}
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
