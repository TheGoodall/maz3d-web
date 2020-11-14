package main

import (
	"io"
	"net/http"
	"net"
)

func hello(w http.ResponseWriter, r *http.Request){
	io.WriteString(w, "Hello, World")
}


func connectToGame() net.Conn {
	conn, err := net.Dial("tcp", "127.0.0.1:46920")
	if err != nil {
		panic("Failed to connect to Game Server")
	}
	return conn
}



func main(){
	http.HandleFunc("/", hello)
	http.ListenAndServe(":8080", nil)
}






