var express = require('express');
var router = express.Router();
var database = require('../database');

router.put('/books/:book.id', (req, res) => {
  const { title } = req.body
  database.updateBook(req.params.bookId)
    .then(function(book) {
      res.render('../views/books/show', {
        book: book
      })
    })
    .catch(function(error) {
       res.status(500).send(error)
    })
});

module.exports = router;
