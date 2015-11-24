var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});
var fs = require('fs')

/* GET users listing. */
router.get('/:prompt/:left/:right', function(req, res) {
  // res.send('respond with a resource');
  console.log("Prompt: ", req.params.prompt, "south");
  console.log("Left:   ", req.params.left);
  console.log("Right:  ", req.params.right);
  
  console.log(__dirname)
  im(__dirname + '/../public/images/photo-blank.jpg')
  .resize(768,576)
  .stroke("#000000", 2)
  

  // Prompt Shadow
  .font("arial", 24)
  .stroke("#000000", 2)
  .fill("#000000")
  .drawText(80, 170, req.params.prompt)
  
  // Prompt
  .font("arial", 24)
  .stroke("#68ff4e", 2)
  .fill("#68ff4e")
  .drawText(80, 165, req.params.prompt)
  

  // Left
  .stroke("#000000", 2)
  .fill("#000000")
  .drawText(100, 290, req.params.left)
  
  // Right
  .drawText(450, 265, req.params.right)


  .toBuffer('jpg', function(err, buffer){
    res.contentType('image/jpg');
    res.send(buffer);
  });
});

module.exports = router;
