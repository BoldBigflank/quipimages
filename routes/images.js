var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});
var fs = require('fs')

router.get('/:prompt/:left/:right.jpg', function(req, res) {
  im(__dirname + '/../public/images/photo-blank.jpg')
  .resize(768,576)
  .stroke("#000000", 1)
  

  // Prompt Shadow
  .font("Helvetica-Bold", 30)
  .stroke("#000000", 1)
  .fill("#000000")
  .drawText(0, -130, wrapText(req.params.prompt, 60), 'center')
  
  // Prompt
  .font("Helvetica-Bold", 30)
  .stroke("#68ff4e", 1)
  .fill("#68ff4e")
  .drawText(0, -135, wrapText(req.params.prompt, 60), 'center')
  

  // Left
  .font("Helvetica-Narrow", 24)
  .stroke("#000000", 1)
  .fill("#000000")
  .drawText(-170, 2, wrapText(req.params.left, 25), 'center')
  
  // Right
  .drawText(160, -15, wrapText(req.params.right, 25), 'center')


  .toBuffer('jpg', function(err, buffer){
    res.contentType('image/jpg');
    res.send(buffer);
  });
});

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
