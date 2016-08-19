var express = require('express');
var router = express.Router();
var database = require('../database');

/* GET home page. */
router.get('/', function(req, res){
  let page = parseInt(req.query.page, 10)
  if (isNaN(page) || page < 1) page = 1
  const searchOptions = {
    search_query: req.query.search_query,
    page: page
  }
  console.log(searchOptions)
  database.searchForBooks(searchOptions)
    .then(function(books){
      res.render('books/index', {
        books: books,
        page: page
      })
    })
    .catch(function(error){
      res.render('error', {
        error: error
      })
    })
});

// app.listen(3000, function() {
//   console.log('Example app listening on port 3000!');
// });

module.exports = router;
