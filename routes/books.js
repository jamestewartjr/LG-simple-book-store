var express = require('express');
var router = express.Router();
var database = require('../database')

// GET /books
// router.get('/', function(req, res, next) {
//   res.render('books/index', {
//     books: books
//   })
// });

// GET /books/:bookId
router.get('/:bookId', function(req, res, next) {
  database.getBookById(req.params.bookId)
    .then(function(book){
      res.render('books/show', {
        book: book
      })
    })
    .catch(function(error){
      res.status(500).send(error)
    })
});

router.get('/', function(req, res, next){
  database.getAllBooksWithAuthors()
    .then(function(books){
      res.render('books/index', {
        books: books
      })
    })
    .catch(function(error){
      throw error;
    })
});

module.exports = router;
