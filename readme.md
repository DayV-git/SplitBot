# To install:

1. Install livesplit server: https://github.com/LiveSplit/LiveSplit.Server
2. Make a twitch dev account for your bot and get an auth token: https://dev.twitch.tv/console/apps/create
3. Install Node.js: https://nodejs.org/en/download/
4. Download repo, open cmd in folder and type `npm install tmi.js --save`
5. Edit config.js

# To run:

1. Add livesplit server to your livesplit layout, and start it (control -> start server). Do this first or bot will crash
2. Type `node bot.js` in cmd


Current commnds to use in twitch chat: !commands, !split, !time, !pb
Command timeout is 10 seconds by default