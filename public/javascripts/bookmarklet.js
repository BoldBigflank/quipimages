javascript: {
    var prompt = false;
    var choices = [];
    var imageHost = "http://quipimages.herokuapp.com/images";
    var defaultText = "I'm literally LOLing #Quiplash @jackboxgames";
    var tweetLink = "http://twitter.com/home?status=";


    function updatePrompt(){
        prompt = $("#state-vote #question-text").html();
        console.log("Prompt = " + prompt);
    }

    function updateChoices(){
        choices = [];

        var domChoices = document.getElementById("quiplash-vote").childNodes;
        for (var i = 0; i < domChoices.length; i++ ){
            var choice = domChoices[i];
            choices.push(choice.innerHTML);
        }
        console.log("Choices = " + choices);
    }

    function sendTweet(event){
        console.log("TweetThis button pressed");
        if(choices.length < 2){
            return false;
        }

        var imageUri = "/" + encodeURIComponent( prompt ) + "/" + encodeURIComponent( choices[0] ) + "/" + encodeURIComponent( choices[1] ) + "/imgur";
        var imageUrl = imageHost + imageUri;

        $.get(imageUrl, function(imgurUrl, status){
            // Get an imgur url
            var tweetMessage = encodeURIComponent(defaultText + " " + imgurUrl);
            
            tweetUrl = tweetLink + tweetMessage;
            var win = window.open(tweetUrl, "_blank");
            win.focus();

            console.log(tweetUrl);
            return false;
        });
    }

    function voteHandler(event){

        console.log("Vote updated");
        if(document.getElementById("quiplash-vote").innerHTML !== ""){
            updateChoices();
            updatePrompt();
        }

    }

    document.getElementById("quiplash-vote").addEventListener('DOMSubtreeModified', voteHandler);

    var playerHolder = document.getElementById("player");
    playerHolder.innerHTML = playerHolder.innerHTML + "<a href='javascript:void(0);' onclick='sendTweet()'>Tweet this</a>";

}
void(0);