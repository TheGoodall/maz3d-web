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

func startHTTPServer(gamestartC chan string, playerlocC chan string, playercountC chan chan int){
	s := sse.NewServer(nil)
	defer s.Shutdown()

	http.Handle("/events/", s)


	go http.ListenAndServe(":8080", nil)

	clients := make(map[int]sse.Client)
	for {
		select {
		case mapjson := <-gamestartC:
			
			s.SendMessage("/events/game", sse.SimpleMessage(mapjson))
		case playerlocation:=  <-playerlocC:

		case pcC := <-playercountC:
			pcC <- s.GetChannel("/events/game").ClientCount()
		}
	}

}

func main(){
	gamestartC := make(chan string)
	playerlocC := make(chan string)
	playercountC := make(chan chan int)

	go startHTTPServer(gamestartC, playerlocC, playercountC)


}






