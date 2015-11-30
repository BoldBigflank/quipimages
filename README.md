Quiplash "Tweet this" images
============================

This contains the logic to create a shareable image of Quiplash prompts and choices.

## To add a "Tweet this" link to your client

https://gist.github.com/BoldBigflank/ba57c191594fa8e5493f


## How it works:

Any text can be added to the image, by going to `/images/:prompt/:left/:right`

`/images/:prompt/:left/:right/tweet` will send a tweet of the image using your authorized twitter account, going through the authorization process on the first time only.
