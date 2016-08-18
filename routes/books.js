var express = require('express');
var router = express.Router();
var database = require('../database');

// index
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

// new
router.get('/new', function(req, res) {
  database.getAllGenres()
    .then(function(genres){
      res.render('books/new',{
        genres: genres
      })
    })
})

// create
router.post('/', function(req, res) {
  database.createBook(req.body.book)
    .catch(function(error){
      res.status(500).send(error)
    })
    .then(function(book){
      res.redirect('/books/'+book.id)
    })
})

// show / read
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

// edit
router.get('/:bookId/edit', function(req, res) {

  Promise.all([
    database.getBookWithAuthorsAndGenresByBookId(req.params.bookId),
    database.getAllGenres()
  ])
    .then(function(results){
      const book = results[0]
      const genres = results[1]

      book.genreIds = book.genres.map(genre => genre.id)

      res.render('books/edit', {
        book: book,
        genres: genres,
      })
    })
    .catch(function(error){
      res.status(500).send(error)
    })
})

// Update
router.post('/:bookId', function(req, res) {
  const bookId = req.params.bookId
  const attributes = req.body.book
  if (typeof attributes.genres === 'string'){
    attributes.genres = [attributes.genres]
  }

  console.log('req.body', JSON.stringify(req.body, null, 4) )
  database.updateBook(bookId, attributes)
    .catch(function(error){
      console.error(error);
      res.status(500).render('error', {error: error})
    })
    .then(function(){
      res.redirect('/books/'+bookId)
    })
})


// delete

module.exports = router;
