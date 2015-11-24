var express = require('express');
var router = express.Router();
var im = require('gm').subClass({imageMagick:true});
var fs = require('fs')

router.get('/:prompt/:left/:right', function(req, res) {
  // res.send('respond with a resource');
  console.log("Prompt: ", req.params.prompt, "south");
  console.log("Left:   ", req.params.left);
  console.log("Right:  ", req.params.right);
  
  console.log(__dirname);
  im(__dirname + '/../public/images/photo-blank.jpg')
  .resize(768,576)
  .stroke("#000000", 2)
  

  // Prompt Shadow
  .font("arial", 24)
  .stroke("#000000", 2)
  .fill("#000000")
  .drawText(0, -130, req.params.prompt, 'center')
  
  // Prompt
  .font("arial", 24)
  .stroke("#68ff4e", 2)
  .fill("#68ff4e")
  .drawText(0, -135, req.params.prompt, 'center')
  

  // Left
  .stroke("#000000", 2)
  .fill("#000000")
  .drawText(-170, 2, req.params.left, 'center')
  
  // Right
  .drawText(160, -15, req.params.right, 'center')


  .toBuffer('jpg', function(err, buffer){
    res.contentType('image/jpg');
    res.send(buffer);
  });
});

router.get('/comment/:message', function(req, res) {
    im(200, 150, "#999")
    .stroke("#000000", 2)
    .fill("#000000")
    .comment("hi"+req.params.message+"|200x150")


    .stroke("#000000", 2)
    .fill("#000000")
    .drawText(10, 10, "Stuff")
    
      
    .toBuffer('jpg', function(err, buffer){
        res.contentType('image/jpg');
        res.send(buffer);
    });
});

module.exports = router;
