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

  // client.query("UPDATE books SET text=($1), complete=($2) WHERE book_id=($3)", [data.text, data.complete, id]);
  //
  // const query = client.query("SELECT * FROM books ORDER BY id ASC");

  // query.on('row', function(row) {
  //   results.push(row)
  // });
//
//   query.on('end', function() {
//     done();
//     return res.json(results);
// });

module.exports = router;
