package main

import (
	"net/http"
	"net"
	"github.com/alexandrevicenzi/go-sse"
)


func handleConnection(conn net.Conn) {
	defer conn.Close()

}

func startTCPServer(){
	ln, err := net.Listen("tcp", ":46920")
	if err != nil {
		panic("Error starting server")
	}
	for {
		conn, err := ln.Accept()
		if err != nil {
			panic("Could not accept connection")
		}
		handleConnection(conn)
	}
}

func startHTTPServer(gamestartC chan string, playerlocC chan string, playercountC chan int){
	s := sse.NewServer(nil)
	defer s.Shutdown()

	http.Handle("/events/", s)


	go http.ListenAndServe(":8080", nil)

	for {
		select {
		case mapjson := <-gamestartC:
			s.SendMessage("/events/gamestart", sse.SimpleMessage(mapjson))
		case playerlocation:=  <-playerlocC:
			s.SendMessage("/events/playerloc", sse.SimpleMessage(playerlocation))
		}
	}

}



func main(){
	gamestartC := make(chan string)
	playerlocC := make(chan string)
	playercountC := make(chan int)

	go startHTTPServer(gamestartC, playerlocC, playercountC)


}






