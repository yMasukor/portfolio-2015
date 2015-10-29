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


	res.render('index', {
		title: req.workTitle,
		partials: {
			threads: getPartialPath(req.workTitle, 'threads'),
			digitalTurbine: getPartialPath(req.workTitle, 'digital-turbine'),
			xyo: getPartialPath(req.workTitle, 'xyo')
		}  
	});
});

router.get('/partial/:workTitle', function(req, res, next) {
	res.render(req.workTitle, { title: req.workTitle });
});


function getPartialPath(workTitle, partial){
	if(workTitle == partial){
		return workTitle;
	}else{
		return null;
	}
}

module.exports = router;
