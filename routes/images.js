var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});
var fs = require('fs');
var imgur = require('imgur-node-api');

imgur.setClientID(process.env.IMGUR_CLIENT || "");


router.get('/:prompt/:left/:right', function(req, res){
    makeImage(req, res);
});

router.get('/:prompt/:left/:right/imgur', function(req, res){
    var imageUrl = "http://quipimages.herokuapp.com/images/" + encodeURIComponent(req.params.prompt) + '/' + encodeURIComponent(req.params.left) + '/' + encodeURIComponent(req.params.right);
    imgur.upload(imageUrl, function (err,result) {
        if(err) console.log("Error:" + err);
        res.send(result.data.link);
    });

});
function makeImage(req, res){
    im(__dirname + '/../public/images/photo-large.png')
    .resize(768,576)
    .stroke("#000000", 1)

    // Left
    // .font("Helvetica-Narrow", 24)
    .font(__dirname + '/../public/fonts/AmaticSC-Regular.ttf', 36)
    .stroke("#000000", 1)
    .fill("#000000")
    .rotate("#000", 5)
    .drawText(-188, -45, wrapText(req.params.left, 23), 'center')
    
    // Right
    .rotate("#000", -10)
    .drawText(80, -130, wrapText(req.params.right, 23), 'center')

    .rotate("#000", 5) // Return to normal
    .crop(768, 576, 0, 0) // Fix the black bars from rotating

    // Prompt Shadow
    // .font("Helvetica-Bold", 30)
    .font(__dirname + '/../public/fonts/Arvo-Regular.ttf', 30)
    .stroke("#000000", 1)
    .fill("#000000")
    .drawText(-100, -270, wrapText(req.params.prompt, 50), 'center')
    
    // Prompt
    // .font("Helvetica-Bold", 30)
    .stroke("#2fb3ed", 1)
    .fill("#2fb3ed")
    .drawText(-100, -275, wrapText(req.params.prompt, 50), 'center')
    
    .toBuffer('png', function(err, buffer){
        res.contentType('image/png');
        res.send(buffer);
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
