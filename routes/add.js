var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET home page. */
// router.post('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// creates insert page that allows user to add books to the DB
router.post('/add', (req, res) => {
  const { title } = req.body
  database.addBook(title)
    .then(function(books) {
      res.render('../views/books/show', {
        books: books
      })
    })
    .catch(function(error) {
       throw error
    })
});

// app.listen(3000, function() {
//   console.log('Example app listening on port 3000!');
// });

module.exports = router;
