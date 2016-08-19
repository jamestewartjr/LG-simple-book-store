var express = require('express');
var router = express.Router();
var database = require('../database');

// // index
// router.get('/', function(req, res, next){
//   res.redirect('/')
// });


// new
// router.get('/new', function(req, res) {
//   database.getAllGenres()
//     .then(function(genres){
//       res.render('books/new',{
//         genres: genres
//       })
//     })
// })

// create
router.post('/', function(req, res) {
  database.createAuthor(req.body.author)
    .catch(function(error){
      res.status(500).send(error)
    })
    .then(function(author){
      res.redirect('/authors/'+author.id)
    })
});


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
router.post('/:authorId', function(req, res) {
  const authorId = req.params.authorId
  const attributes = req.body.author
  if (typeof attributes.genres === 'string'){
    attributes.genres = [attributes.genres]
  }

  console.log('req.body', JSON.stringify(req.body, null, 4) )
  database.updateAuthor(authorId, attributes)
    .catch(function(error){
      console.error(error);
      res.status(500).render('error', {error: error})
    })
    .then(function(){
      res.redirect('/authors/'+authorId)
    })
})


// delete

module.exports = router;
