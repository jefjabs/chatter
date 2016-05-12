package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/boltdb/bolt"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type user struct {
	username string
	src      string
	name     string
}

type message struct {
	Name string
	Body string
	Time string
	From string
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

//MessageHandler will handle the message CRUD processes
func MessageHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	key := vars["key"]
	db, err := bolt.Open("messages.db", 0600, nil)

	switch r.Method {
	case "GET":
		receiver := strings.Split(key, "-")[1]
		key = strings.Split(key, "-")[0]
		if err != nil {
			log.Fatal(err)
		} else {
			db.Update(func(tx *bolt.Tx) error {
				if receiver == "" {
					io.WriteString(w, "[]")
					return nil
				}

				//messagesBucket := tx.Bucket([]byte(key))
				messagesBucket, _ := tx.CreateBucketIfNotExists([]byte(key))
				jsonStr := "["
				messagesBucket.ForEach(func(k, v []byte) error {
					var messageItem message
					json.Unmarshal(v, &messageItem)
					if messageItem.Name == receiver || messageItem.Name == key {
						jsonStr += string(v)
						jsonStr += ","
					}
					return nil
				})
				jsonStr = strings.TrimSuffix(jsonStr, ",")
				jsonStr += "]"
				io.WriteString(w, jsonStr)
				return nil
			})
		}
	case "POST":
		if err != nil {
			log.Fatal(err)
		} else {
			db.Update(func(tx *bolt.Tx) error {
				decoder := json.NewDecoder(r.Body)
				var m message
				errdec := decoder.Decode(&m)
				if errdec != nil {
					panic(errdec)
				}

				if key == "" {
					io.WriteString(w, "Please provide the recipients name")
					return nil
				}

				b, _ := json.Marshal(m)
				data := string(b[:])

				messagesBucket, _ := tx.CreateBucketIfNotExists([]byte(key))
				messagesBucketOwn, _ := tx.CreateBucketIfNotExists([]byte(m.From))
				messagesBucket.Put([]byte(m.Time), []byte(data))
				messagesBucketOwn.Put([]byte(m.Time), []byte(data))
				io.WriteString(w, "Success")
				return nil
			})
		}
	}
	defer db.Close()
}

//UsersHandler will be handling the creation and listing of users
func UsersHandler(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	key := vars["key"]
	db, _ := bolt.Open("messages.db", 0600, nil)

	if key == "" {
		io.WriteString(w, key)
		db.Update(func(tx *bolt.Tx) error {
			usersBucket, _ := tx.CreateBucketIfNotExists([]byte("users"))
			total := 0
			count := 0

			io.WriteString(w, "[")
			usersBucket.ForEach(func(k, v []byte) error {
				total++
				return nil
			})

			usersBucket.ForEach(func(k, v []byte) error {
				count++
				io.WriteString(w, "{\"username\":\""+string(v)+"\"}")
				if count < total {
					io.WriteString(w, ",")
				}
				return nil
			})
			io.WriteString(w, "]")
			return nil
		})
	} else {
		db.Update(func(tx *bolt.Tx) error {
			usersBucket, _ := tx.CreateBucketIfNotExists([]byte("users"))
			count := 0
			usersBucket.ForEach(func(k, v []byte) error {
				if key == string(v) {
					count++
				}
				return nil
			})
			if count == 0 {
				usersBucket.Put([]byte(key), []byte(key))
			}
			return nil
		})
	}
	defer db.Close()
}

//UpdatesHandler listens to new messages and notify the frontend using websockets
func UpdatesHandler(w http.ResponseWriter, r *http.Request) {

	//vars := mux.Vars(r)
	//key := vars["key"]
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	for {
		messageType, _, err := conn.ReadMessage()
		if err != nil {
			return
		}
		if err = conn.WriteMessage(messageType, []byte("Hello There!")); err != nil {
			return
		}
	}
}
