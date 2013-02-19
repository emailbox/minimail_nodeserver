
# Minimail server-side  
Run your own minimail server instance. Easily deploy to heroku for piggyback SSL and a free dyno. 

## Install  
1. Register as an emailbox developer at http://getemailbox.com/first
1. Fork this repo
1. Deploy to heroku (https://devcenter.heroku.com/articles/nodejs) and note the newly-created app name (agile-something-389 or similar)
1. Modify the manifest.json (change package name, all URLs should point use your heroku subdomain)
1. Create a new app on emailbox: https://getemailbox.com/developers and copy/paste your manifest.json
1. Modify the mobile app's creds.js (https://github.com/emailbox/minimail_mobileapp) to use your heroku app

## What the server does 
- Accept incoming requests from emailbox when a new email arrives
- Label emails as Leisure
- Send Push Notifications

## manifest.json  
You MUST customize the manifest.json

