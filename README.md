# MHDiscordBot
Discord dedicated to Markham Hill server

## Setup Instructions (windows)
1. pull this repository to your local machine
2. open command line in the same folder as `bot.js` and type `npm install`. This will install the required modules.
3. to start the server, type `node bot.js`

## Adding the bot to your discord
1. After creating a new bot in https://discordapp.com/developers/applications/me, click the bot you want to add
2. Copy the client ID
3. Copy this link to your browser URL and replace the "<CLIENT_ID>" (including the triangle brackets) to your browser URL:
`https://discordapp.com/oauth2/authorize?client_id=<CLIENT_ID>&scope=bot`
4. Press enter
5. Follow the UI to add the bot to the appropriate channels.
