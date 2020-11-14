package main

import (
	"net/http"
	"time"
	"net"
	"github.com/alexandrevicenzi/go-sse"
)


func handleConnection(conn net.Conn) {


}

func startTCPServer(){
	ln, err := net.Listen("tcp", ":46920")
	if err != nil {
		panic("Error starting server")
	}
	conn, err := ln.Accept()
	if err != nil {
		panic("Could not accept connection")
	}
	defer conn.Close()




}

func startHTTPServer(gamestartC chan string, playerlocC chan string, playercountC chan chan int){
	s := sse.NewServer(nil)
	defer s.Shutdown()

	http.Handle("/events/", s)
	static := http.FileServer(http.Dir("./Web"))
	box := packr.NewBox("./Web")
	http.Handle("/", static)


	go http.ListenAndServe(":8080", nil)

	for {
		select {
		case mapjson := <-gamestartC:
			s.SendMessage("/events/game", sse.SimpleMessage(mapjson))
		case playerlocation:=  <-playerlocC:
			s.SendMessage("/events/game", sse.SimpleMessage(playerlocation))
		case pcC := <-playercountC:
			k, _ :=s.GetChannel("/events/game")
			pcC <- k.ClientCount()
		}
	}

}

func main(){
	gamestartC := make(chan string)
	playerlocC := make(chan string)
	playercountC := make(chan chan int)

	go startHTTPServer(gamestartC, playerlocC, playercountC)
	go startTCPServer()


	time.Sleep(1*time.Second)

}






