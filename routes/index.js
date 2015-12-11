var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    var fs = require('fs');
    var file = fs.readFileSync(__dirname + "/../public/javascripts/bookmarklet.js", "utf8");
    res.render('index', { bookmarklet: file });
});

module.exports = router;
