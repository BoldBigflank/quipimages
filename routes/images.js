var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});
var fs = require('fs');
var Twitter = require("node-twitter-api");
var url = require('url');
var util  = require('util');

var twitter = new Twitter({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callback: "http://quipimage.herokuapp.com/twitter/callback"
});

var defaultText = " #Quiplash @jackboxgames";

var tweetLink = "http://twitter.com/home?status=";

var positions = {
    1: {"x": -375,  "y": -157},
    2: {"x": -145,     "y": -221},
    3: {"x": 235,   "y": -68},
    4: {"x": -420,  "y": -113},
    5: {"x": -145,     "y": -113},
    6: {"x": 125,   "y": -113},
    7: {"x": -315,  "y": 124},
    8: {"x": -145,     "y": -4},
    9: {"x": 180,   "y": 33}
};

var arrangements = {
    3: ["4", "5", "6"],
    4: ["1", "3", "7", "9"],
    5: ["2", "4", "5", "6", "8"],
    6: ["1", "2", "3", "7", "8", "9"],
    7: ["1", "2", "3", "5", "7", "8", "9"],
    8: ["1", "2", "3", "4", "6", "7", "8", "9"]
};

router.get('/', function(req, res){
    makeImage(req.query.prompt, req.query.choice, function(buffer){
        res.contentType('image/png');
        res.send(buffer);
    });
});

router.get('/tweet', function(req, res){
    if(!req.session.accessToken){
        req.session.originalUrl = req.originalUrl;
        res.redirect('/twitter/request-token');
    } else {

        var imageUri = "/images/?" + url.parse(req.url).query;
        
        res.render('tweet-edit', {
            title: "Send Tweet",
            image: imageUri,
            prompt: "" + req.query.prompt
        });
    }
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
        // .resize(768,576)
        .stroke("#000000", 0.1)

        // Left
        // .font("Helvetica-Narrow", 24)
        .font(__dirname + '/../public/fonts/JustAnotherHand.ttf', fontSizeForText(choices[0])*1.5)
        .stroke("#000000", 0.1)
        .fill("#000000")
        .rotate("#000", 6)
        .drawText(-265, 18, splitText(choices[0], 18), 'center')
        
        // Right
        .font(__dirname + '/../public/fonts/JustAnotherHand.ttf', fontSizeForText(choices[1])*1.5)
        .rotate("#000", -12)
        .drawText(99, -111, splitText(choices[1], 18), 'center')

        .rotate("#000", 6) // Return to normal
        .crop(1024, 768, 0, 0) // Fix the black bars from rotating

        // Prompt Shadow
        .font(__dirname + '/../public/fonts/Arvo-Regular.ttf', 40)
        .stroke("#000000", 0.1)
        .fill("#000000")
        .drawText(-173, -375, splitText(prompt, 42), 'center')
        
        // Prompt
        .stroke("#2fb3ed", 0.1)
        .fill("#2fb3ed")
        .drawText(-173, -380, splitText(prompt, 42), 'center')
        
        .toBuffer('png', function(err, buffer){
            cb(buffer);
        });
    } else {
        var arrangement = arrangements[choices.length];
        
        // Create the image
        var image = im(__dirname + '/../public/images/arrangement-' + choices.length + '.png')
        // Originally 1024x768
        // .resize(768,576)
        .stroke("#000000", 0.1)

        // Write the choices
        .font(__dirname + '/../public/fonts/JustAnotherHand.ttf', 32)
        .stroke("#000000", 0.1)
        .fill("#000000");
        
        var position;
        // Left tilted choices
        image.rotate("#000", 5);
        for(var i = 0; i < choices.length; i++){
            if( ["3", "7"].indexOf(arrangement[i]) > -1 ){
                position = positions[arrangement[i]];
                image
                .font(__dirname + '/../public/fonts/JustAnotherHand.ttf', fontSizeForText(choices[i]))
                .fill("#000000")
                .stroke("#000000", 0.1)
                .drawText(position.x, position.y, splitText(choices[i], 18), 'center');
            }
        }

        // Right tilted choices
        image.rotate("#000", -10);
        for(i = 0; i < choices.length; i++){
            if(["1", "9"].indexOf(arrangement[i]) > -1 ){
                position = positions[arrangement[i]];
                image
                .font(__dirname + '/../public/fonts/JustAnotherHand.ttf', fontSizeForText(choices[i]))
                .fill("#000000")
                .stroke("#000000", 0.1)
                .drawText(position.x, position.y, splitText(choices[i], 18), 'center');
            }
        }

        // Normal choices
        image.rotate("#000", 5);
        for(i = 0; i < choices.length; i++){
            if(["2", "4", "5", "6", "8"].indexOf(arrangement[i]) > -1 ){
                position = positions[arrangement[i]];
                image
                .font(__dirname + '/../public/fonts/JustAnotherHand.ttf', fontSizeForText(choices[i]))
                .fill("#000000")
                .stroke("#000000", 0.1)
                .drawText(position.x, position.y, splitText(choices[i], 18), 'center');
            }
        }


        // Prompt Shadow
        image
        .font(__dirname + '/../public/fonts/Arvo-Regular.ttf', 40)
        .stroke("#000000", 0.1)
        .fill("#000000")
        .drawText(-145, -365, splitText(prompt, 42), 'center')
        
        // Prompt
        .stroke("#2fb3ed", 0.1)
        .fill("#2fb3ed")
        .drawText(-145, -370, splitText(prompt, 42), 'center')
        
        .crop(1024, 768, 0, 0)
        .resize(768,576)
        .toBuffer('png', function(err, buffer){
            cb(buffer);
        });
    }
    
}

function splitText(text, maxChars){
    if( text.length >= maxChars ){
        // Split it in two
        var i = text.indexOf(' ', text.length/2);
        if(i < 0) i = text.lastIndexOf(' ', text.length/2);
        if(i < 0){
            return text.slice(0, text.length/2) + '\n' + text.slice(text.length/2);
        } else {
            return text.slice(0, i) + '\n' + text.slice(i+1);
        }
    }
    return text;
}

function fontSizeForText(text){
    text = splitText(text, 18);
    var i = text.indexOf('\n');
    var length = ( i < 0 ) ? text.length : Math.max(i, text.length-i-1);
    if(length < 8){
        return 58;
        
    } else if (length < 13) {
        return 50;

    } else if (length < 18) {
        return 38;

    } else if (length < 23) {
        return 28;

    } else if (length < 28) {
        return 22;

    } else if (length < 38) {
        return 18;

    } else {
        return 14;

    }
}



module.exports = router;
