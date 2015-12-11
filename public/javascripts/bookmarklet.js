javascript: {
    if(typeof tweetThisButtonInitialized === undefined)
        var tweetThisButtonInitialized = false;
    var playerHolder = document.getElementById("player");
    var quiplashVote = document.getElementById("quiplash-vote");
    if( document.getElementById("demo-button") ) {
        alert("You must call this in game as a bookmarklet to work");
    } else if (!quiplashVote) {
        alert("Press this bookmarklet when you're in a game");
    }
    
    var prompt = false;
    var choices = [];
    var imageHost = "http://quipimages.herokuapp.com/images";
    
    function updatePrompt(){
        prompt = $("#state-vote #question-text").text();
    }

    function updateChoices(){
        var domChoices = document.getElementById("quiplash-vote").childNodes;
        if(domChoices.length > 2 && domChoices.length == choices.length) return;

        choices = [];
        for (var i = 0; i < domChoices.length; i++ ){
            var choice = domChoices[i];
            choices.push(choice.innerHTML);
        }
    }

    function sendTweet(event){
        if(choices.length < 2){
            return false;
        }

        var imageUri = "/tweet?prompt=" + encodeURIComponent( prompt );

        for(var i = 0; i < choices.length; i++){
            imageUri += "&choice=" + encodeURIComponent( choices[i] );
        }
        var imageUrl = imageHost + imageUri;
        
        var win = window.open(imageUrl, "_blank");
        win.focus();
    }

    function voteHandler(event){
        if(document.getElementById("quiplash-vote").innerHTML !== ""){
            updateChoices();
            updatePrompt();
            var tweetLink = document.getElementById("tweetLink");
            tweetLink.innerHTML = "Tweet this";
        }

    }
    
    if(!tweetThisButtonInitialized){
        if (quiplashVote !== null) quiplashVote.addEventListener('DOMSubtreeModified', voteHandler);
        if (playerHolder) playerHolder.innerHTML = playerHolder.innerHTML + "<a id='tweetLink' href='javascript:void(0);' onclick='sendTweet()'></a>";
        tweetThisButtonInitialized = true;
    }
    if (playerHolder) playerHolder.style.backgroundColor = "#ffcc00";

}
void(0);