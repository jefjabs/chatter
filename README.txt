Direct messaging app using the following main technologies:
- Golang
- AngularJS
- jQuery
- Bolt DB

Main libraries used :
- Golang bolt db
- Gorilla mux
- Gorilla websockets
- Angular Resource
- Plain websockets

This app uses boltdb to store data in key/value pair, every user has his own bucket of messages that contains messages that was sent to him from another user and messages that he sent to other users.
The main convention on transfering data is a REST API requests provided by AngularJS Resource library and the backend processes is handled by Golang binary which then stores the data into bolt db.

Possible issues encountered in this source code :
- Using boltdb is really fast when only few users are sending the messages at a time ( 1-100 ), You can experience delays in sending message when there are plenty of users sending message at the same time. This is because boltdb only uses 1 file to store all the messages and it locks the database file when updating the database leaving other connections pending, one solution is to this is to use full featured relational database with table level or row level locking features to reduce delays.
- The app doesn't have any authentications for now, this should be implemented in the future.
- Prone to DDoS and message spamming, data filters and validations are not yet implemented in this app.

Building the app
go build main.go api.go
./main

or
go run main.go api.go


Implemented Features:
    Must have features:
        - Data on server is stored in memory
        - Messages appear in chronological order (Template: 2016-01-01 10:02:15 John: Hi there!)
        - Chat supports multiple users
        - Correct work at least in one web browser
        - Minimum possible delay between sending the message and its appearance to other chat users
    Should have features (implement at least few of them):
        - ~~Session recovery and display of missed messages after the unavailability of the Internet channel~~
        - Unique nicknames
        - ~~Rich-message formatting, auto detection of urls~~
        - The list of chat participants, insert nick in a message by clicking on him (as a form of address)
        - Ability to logout from the chat
        - Simple design with CSS
        - Auto-scroll the message window
        - ~~Show the warning if the server is currently unavailable~~
        - ~~Support of users time zone when show messages of other chat participants~~
        - The design of communication protocol between client and server allows to easily writing of client in another programming language.
        Could have features (if the project will be so exciting for you):
    Could Have Feature:
        - ~~Protection against XSS~~
        - ~~Flood-filter (limit frequency of messages via IP, for example)~~
        - Support for all modern browsers
        - Save nick, ~~settings, themes, ...~~
        - ~~Display settings in the form of presets (colors, frames, ...)~~
        - ~~Simple commands (like --logout, --change-nick --kick)~~
        - ~~User moderator (able to do --kick)~~
        - ~~Sound or a graphical alert when nick mentioned in the chat~~
        - The ability to communicate under different nicknames in two tabs of the same browser
        - ~~Transfer of files (drag-n-drop in the browser, link to the file appears in the message window)~~
