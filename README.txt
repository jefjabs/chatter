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
