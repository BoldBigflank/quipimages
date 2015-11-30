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

router.get('/', function(req, res){
    makeImage(req.query.prompt, req.query.choice, function(buffer){
        res.contentType('image/png');
        res.send(buffer);
    });
});

router.get('/tweet', function(req, res){
    var imageUri = "/images/?prompt=" + encodeURIComponent( req.query.prompt ) + "&choice=" + encodeURIComponent( req.query.choice[0] ) + "&choice=" + encodeURIComponent( req.query.choice[1] );
    
    res.render('tweet-edit', {
        title: "Send Tweet",
        image: imageUri,
        prompt: "" + req.query.prompt
    });
});

router.post('/tweet', function(req, res){
    if(!req.session.accessToken){
        req.session.originalUrl = req.originalUrl;
        res.redirect('/twitter/request-token');
    } else {
        var tweetMessage = encodeURIComponent( defaultText );
        var redirectUrl = tweetLink + tweetMessage;

        makeImage(req.query.prompt, req.query.choice, function(buffer){
            var params = {
                media:buffer.toString('base64'),
                isBase64:true
            };

            twitter.uploadMedia(params, req.session.accessToken, req.session.accessTokenSecret, function(err, upload_data, response){
                if(err)console.log("Upload error:", err);
                // upload_data.media_id test 670888967030444032
                twitter.statuses("update", {
                        status: req.body.tweettext,
                        media_ids: upload_data.media_id_string
                    },
                    req.session.accessToken,
                    req.session.accessTokenSecret,
                    function(error, data, response) {
                        if (error) {
                            // something went wrong 
                            res.render('tweet-result', { title: 'Express', error:true });
                        } else {
                            // data contains the data sent by twitter 
                            res.render('tweet-result', { title: 'Express', error:false });
                        }
                    }
                );
            });
        });
    }
});

router.get('/:prompt/:left/:right', function(req, res){
    makeImage(req.params.prompt, [req.params.left, req.params.right], function(buffer){
        res.contentType('image/png');
        res.send(buffer);
    });
});

function makeImage(prompt, choices, cb){

    if(choices.length == 2){
        im(__dirname + '/../public/images/photo-centered.png')
        .resize(768,576)
        .stroke("#000000", 1)

        // Left
        // .font("Helvetica-Narrow", 24)
        .font(__dirname + '/../public/fonts/AmaticSC-Regular.ttf', 36)
        .stroke("#000000", 1)
        .fill("#000000")
        .rotate("#000", 6)
        .drawText(-199, 0, wrapText(choices[0], 23), 'center')
        
        // Right
        .rotate("#000", -12)
        .drawText(74, -91, wrapText(choices[1], 23), 'center')

        .rotate("#000", 6) // Return to normal
        .crop(768, 576, 0, 0) // Fix the black bars from rotating

        // Prompt Shadow
        // .font("Helvetica-Bold", 30)
        .font(__dirname + '/../public/fonts/Arvo-Regular.ttf', 30)
        .stroke("#000000", 1)
        .fill("#000000")
        .drawText(-130, -280, wrapText(prompt, 42), 'center')
        
        // Prompt
        // .font("Helvetica-Bold", 30)
        .stroke("#2fb3ed", 1)
        .fill("#2fb3ed")
        .drawText(-130, -285, wrapText(prompt, 42), 'center')
        
        .toBuffer('png', function(err, buffer){
            cb(buffer);
        });
    } else {
        // Make the 8 choice version
        cb(null);
    }
    
}



function wrapText(text, maxChars) {
    if(!text) return "";
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
