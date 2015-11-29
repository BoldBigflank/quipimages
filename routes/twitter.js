var express = require('express');
var router = express.Router();

var Twitter = require("node-twitter-api");

var twitter = new Twitter({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callback: "http://quipimages.herokuapp.com/twitter/callback"
});

router.get('/:prompt/:left/:right', function(req, res){
    makeImage(req, res);
});

router.get("/request-token", function(req, res) {
    twitter.getRequestToken(function(err, requestToken, requestSecret, results) {
        if (err)
            res.status(500).send(err);
        else {
            console.log("Found token", requestToken);
            req.session.requestToken = requestToken;
            req.session.requestSecret = requestSecret;
            res.redirect("https://twitter.com/oauth/authenticate?oauth_token=" + requestToken);
        }
    });
});

router.get("/callback", function(req, res){
    // Access is granted
    // Make the user do what it was going to do all along
    twitter.getAccessToken(req.query.oauth_token, req.session.requestSecret, req.query.oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if (error) {
        console.log(error);
        res.status(200).send("Error");
    } else {
        //store accessToken and accessTokenSecret somewhere (associated to the user) 
        req.session.accessToken = accessToken;
        req.session.accessTokenSecret = accessTokenSecret;
        // Send the user back to whatever they were doing
        if(req.session.originalUrl) res.redirect(req.session.originalUrl);
        else{
            res.status(200).send("No error");
        }
    }
});

});

router.get("/access-token", function(req, res) {
    // Handed back from Twitter
    var requestToken = req.query.oauth_token;
    var verifier = req.query.oauth_verifier;

    twitter.getAccessToken(req.session.requestToken, req.session.requestSecret, verifier, function(err, accessToken, accessSecret) {
        if (err)
            res.status(500).send(err);
        else
            twitter.verifyCredentials(accessToken, accessSecret, function(err, user) {
                if (err)
                    res.status(500).send(err);
                else
                    res.send(user);
            });
    });
});

module.exports = router;