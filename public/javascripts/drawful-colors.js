javascript: {
    var color = null;
    var c = $('canvas.sketchpad')[0];
    var swidth = 32;
    var sheight = 32;
    var emojiX = 0;
    var emojiY = 0;
        

    function changeColor(newColor) {
        color = (newColor == "") ? null : newColor;
        if (color) $("#drawful-instructions").css('color', color);
    };

    function drawEmoji(e){
        if(color == 'emoji'){
            var img=document.getElementById("emoji-sheet")
            var scale = parseInt(c.width) / parseInt(c.style.width);
            c.getContext('2d').drawImage(img, emojiX*swidth, emojiY*sheight, swidth, sheight, scale*(e.offsetX)-(swidth/2), scale*(e.offsetY)-(sheight/2), swidth, sheight)
            newEmoji();
        }
    }

    function newEmoji(){
        emojiX = Math.floor((Math.random() * 35));
        emojiY = Math.floor((Math.random() * 35));
        var img=document.getElementById("emoji-sheet");
        var picker=document.getElementById("emoji-picker");

        picker.style.backgroundPosition = emojiX * -32 + "px";
        picker.style.backgroundPositionY= emojiY * -32 + "px";
    }

    function updatedDraw(e) {
        if (color) {
            if(color && color != 'emoji'){
                c.getContext('2d').strokeStyle = color;
            }
        }
    };
    $('#drawful-prompt').first().html("<img id='emoji-sheet' style='display:none;' src='https://s3.amazonaws.com/alexboldit/sheet_apple_32.png'></img> <table style='margin:auto;' class='prompt drawful-text'> <tr style='height:25px'> <td bgcolor='#1F75FE' width=25px onclick='changeColor(\"#1F75FE\")'></td> <td bgcolor='#1CAC78' width=25px onclick='changeColor(\"#1CAC78\")'></td> <td bgcolor='#EE204D' width=25px onclick='changeColor(\"#EE204D\")'></td> <td bgcolor='#FCE883' width=25px onclick='changeColor(\"#FCE883\")'></td> <td bgcolor='#000000' width=25px onclick='changeColor(\"#000000\")'></td> <td bgcolor='#B4674D' width=25px onclick='changeColor(\"#B4674D\")'></td> <td bgcolor='#FF7538' width=25px onclick='changeColor(\"#FF7538\")'></td> <td bgcolor='#926EAE' width=25px onclick='changeColor(\"#926EAE\")'></td> <td bgcolor='#0D98BA' width=25px onclick='changeColor(\"#0D98BA\")'></td> <td bgcolor='#FFAACC' width=25px onclick='changeColor(\"#FFAACC\")'></td> <td bgcolor='#C5E384' width=25px onclick='changeColor(\"#C5E384\")'></td> <td bgcolor='#FFAE42' width=25px onclick='changeColor(\"#FFAE42\")'></td> <td bgcolor='#FFFFFF' style='border:1px solid;' width=25px onclick='changeColor(\"FFFFFF\")'></td> <td id='emoji-picker' style='background-image:url(https://s3.amazonaws.com/alexboldit/sheet_apple_32.png);height:32px;' width=32px onclick='changeColor(\"emoji\")'></td> </tr> </table>");
    c.addEventListener('mousemove', updatedDraw);
    c.addEventListener('touchmove', updatedDraw);
    c.addEventListener('mousedown', drawEmoji);
    c.addEventListener('touchstart', drawEmoji);
    newEmoji();
};
void(0);