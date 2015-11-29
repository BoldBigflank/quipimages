var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});
var fs = require('fs')


router.get('/:prompt/:left/:right', function(req, res){
    makeImage(req, res);
});

function makeImage(req, res){
    im(__dirname + '/../public/images/photo-large.png')
    .resize(768,576)
    .stroke("#000000", 1)
    

    // Prompt Shadow
    // .font("Helvetica-Bold", 30)
    .font(__dirname + '/../public/fonts/Arvo-Regular.ttf', 30)
    .stroke("#000000", 1)
    .fill("#000000")
    .drawText(0, -130, wrapText(req.params.prompt, 60), 'center')
    
    // Prompt
    // .font("Helvetica-Bold", 30)
    .stroke("#68ff4e", 1)
    .fill("#68ff4e")
    .drawText(0, -135, wrapText(req.params.prompt, 60), 'center')
    

    // Left
    // .font("Helvetica-Narrow", 24)
    .font(__dirname + '/../public/fonts/AmaticSC-Regular.ttf', 36)
    .stroke("#000000", 1)
    .fill("#000000")
    .rotate("#000", 5)
    .drawText(-195, -45, wrapText(req.params.left, 25), 'center')
    
    // Right
    .rotate("#000", -10)
    .drawText(76, -130, wrapText(req.params.right, 25), 'center')

    .rotate("#000", 5) // Return to normal
    .crop(768, 576, 0, 0) // Fix the black bars from rotating
    .toBuffer('jpg', function(err, buffer){
        res.contentType('image/jpg');
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
