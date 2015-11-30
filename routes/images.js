var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});
var fs = require('fs');
var Twitter = require("node-twitter-api");
var util  = require('util');

var twitter = new Twitter({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callback: "http://quipimage.herokuapp.com/twitter/callback"
});


var defaultText = " #Quiplash @jackboxgames";

var tweetLink = "http://twitter.com/home?status=";

router.get('/tweet', function(req, res){
    makeImage(req.query.prompt, req.query.left, req.query.right, function(buffer){
        res.contentType('image/png');
        res.send(buffer);
    });
});

router.get('/:prompt/:left/:right', function(req, res){
    makeImage(req.params.prompt, req.params.left, req.params.right, function(buffer){
        res.contentType('image/png');
        res.send(buffer);
    });
});

router.get('/:prompt/:left/:right/tweet', function(req, res){
    if(!req.session.accessToken){
        req.session.originalUrl = req.originalUrl;
        res.redirect('/twitter/request-token');
    } else {
        var tweetMessage = encodeURIComponent( defaultText );
        var redirectUrl = tweetLink + tweetMessage;

        makeImage(req.params.prompt, req.params.left, req.params.right, function(buffer){
            var params = {
                media:buffer.toString('base64'),
                isBase64:true
            };

            twitter.uploadMedia(params, req.session.accessToken, req.session.accessTokenSecret, function(err, upload_data, response){
                if(err)console.log("Upload error:", err);
                // upload_data.media_id test 670888967030444032
                twitter.statuses("update", {
                        status: req.params.prompt + defaultText,
                        media_ids: upload_data.media_id_string
                    },
                    req.session.accessToken,
                    req.session.accessTokenSecret,
                    function(error, data, response) {
                        if (error) {
                            // something went wrong 
                            res.status(200).send(error);
                        } else {
                            // data contains the data sent by twitter 
                            res.status(200).send("Your tweet has been sent. You may now close this window.");
                        }
                    }
                );
            });
        });
    }
});

function makeImage(prompt, left, right, cb){
// function makeImage(req, res){
    im(__dirname + '/../public/images/photo-large.png')
    .resize(768,576)
    .stroke("#000000", 1)

    // Left
    // .font("Helvetica-Narrow", 24)
    .font(__dirname + '/../public/fonts/AmaticSC-Regular.ttf', 36)
    .stroke("#000000", 1)
    .fill("#000000")
    .rotate("#000", 5)
    .drawText(-188, -45, wrapText(left, 23), 'center')
    
    // Right
    .rotate("#000", -10)
    .drawText(80, -130, wrapText(right, 23), 'center')

    .rotate("#000", 5) // Return to normal
    .crop(768, 576, 0, 0) // Fix the black bars from rotating

    // Prompt Shadow
    // .font("Helvetica-Bold", 30)
    .font(__dirname + '/../public/fonts/Arvo-Regular.ttf', 30)
    .stroke("#000000", 1)
    .fill("#000000")
    .drawText(-110, -270, wrapText(prompt, 48), 'center')
    
    // Prompt
    // .font("Helvetica-Bold", 30)
    .stroke("#2fb3ed", 1)
    .fill("#2fb3ed")
    .drawText(-110, -275, wrapText(prompt, 48), 'center')
    
    .toBuffer('png', function(err, buffer){
        cb(buffer);
    });
}



function wrapText(text, maxChars) {
    var ret = [];
    var words = text.split(/\b/);

    var currentLine = '';
    var lastWhite = '';
    words.forEach(function(d) {
        var prev = currentLine;
        currentLine += lastWhite + d;

        var l = currentLine.length;

        if (l > maxChars) {
            ret.push(prev.trim());
            if(d.length > maxChars){
                ret.push(d.substring(0, maxChars));
                d = d.substring(maxChars);
            }
            currentLine = d;
            lastWhite = '';
        } else {
            var m = currentLine.match(/(.*)(\s+)$/);
            lastWhite = (m && m.length === 3 && m[2]) || '';
            currentLine = (m && m.length === 3 && m[1]) || currentLine;
        }
    });

    if (currentLine) {
        ret.push(currentLine.trim());
    }

    return ret.join("\n");
}


module.exports = router;
