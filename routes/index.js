var express = require('express');
var router = express.Router();

router.param('workTitle', function(req, res, next, workTitle) {
  // sample user, would actually fetch from DB, etc...
  req.workTitle = workTitle
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/works/:workTitle', function(req, res, next) {
  res.render('index', { title: req.workTitle });
});



module.exports = router;
