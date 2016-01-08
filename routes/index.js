var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var fs = require('fs');
    var file = fs.readFileSync(__dirname + "/../public/javascripts/bookmarklet.js", "utf8");
    res.render('index', { bookmarklet: file.replace("\n", "") });
});

router.get('/drawful', function(req, res) {
    var fs = require('fs');
    var file = fs.readFileSync(__dirname + "/../public/javascripts/drawful-colors.js", "utf8");
    res.render('drawful-colors', { bookmarklet: file.replace("\n", "") });
});



module.exports = router;
