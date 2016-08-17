var express = require('express');
var router = express.Router();
var database = require('../database');

router.get('/new', function(req, res) {
  database.getAllGenres()
    .then(function(genres){
      res.render('books/new',{
        genres: genres
      })
    })
})

router.post('/', function(req, res) {
  database.createBook(req.body.book)
    .catch(function(error){
      res.status(500).send(error)
    })
    .then(function(book){
      res.redirect('/books/'+book.id)
    })
})

// Book Show route
router.get('/:bookId', function(req, res) {
  database.getBookWithAuthorsAndGenresByBookId(req.params.bookId)
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
  database.searchForBooks(req.query)
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
