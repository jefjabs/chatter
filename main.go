package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
)

//Implements the application URL routing and point each request into their respective handlers
func main() {
	r := mux.NewRouter()
	r.HandleFunc("/users", UsersHandler)
	r.HandleFunc("/users/{key}", UsersHandler).Name("key")
	r.HandleFunc("/messages", MessageHandler)
	r.HandleFunc("/messages/{key}", MessageHandler).Name("key")
	r.HandleFunc("/updates/{key}", UpdatesHandler).Name("key")
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/")))
	http.Handle("/", r)
	fmt.Println("Listening on localhost:8080")
	http.ListenAndServe(":8080", nil)
}
