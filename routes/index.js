var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// app.listen(3000, function() {
//   console.log('Example app listening on port 3000!');
// });

module.exports = router;
