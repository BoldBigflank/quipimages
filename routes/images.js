var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});


/* GET users listing. */
router.get('/:prompt/:left/:right', function(req, res) {
  // res.send('respond with a resource');
  console.log("Prompt: ", req.params.prompt, "south");
  console.log("Left:   ", req.params.left);
  console.log("Right:  ", req.params.right);

  im( 480, 320, "#66666699" )
  .stroke("#000000", 2)
  .fill("#FF0000")
  // .fontSize(100)
  .font("arial", 20)
  .drawArc(80, 10, 90, 20, 0, 180)
  .drawText(0, 0, "Prompt" + req.params.prompt)
  // .drawText(10, 50, "Left: " + req.params.left)
  // .drawText(20, 100, "Right: " + req.params.right)
  .toBuffer('PNG', function(err, buffer){
    res.contentType('image/png');
    res.send(buffer);
  });
});

module.exports = router;
