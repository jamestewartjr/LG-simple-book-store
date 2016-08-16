'use strict';

var promise = require('../schema.sql');

var options = {
  promiseLib: promise
};

var pgp = require('pg-promise');

var cn = {
  host: 'localhost',
  port: 3000,
  database: 'clammy-tayra',
  user: 'myUser',
  password: 'myPassword'
};

var db = pgp(cn);

db.any("select books.* from books", [true])
  .then(function(data){
    console.log("DATA:", data);
  })
  .catch(function (error){
    console.log("ERROR:". error);
  })
.finally(function() {
  pgp.end();
});
