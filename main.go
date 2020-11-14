package main

import (
	"net/http"
	//"encoding/json"
	"strconv"
	"strings"
	"bufio"
	"net"
	"github.com/gobuffalo/packr"
	"github.com/alexandrevicenzi/go-sse"
)


func handleConnection(conn net.Conn) {


}

func startTCPServer(gamestartC chan string, playerlocC chan string, playercountC chan chan int, StopC chan bool){
	ln, err := net.Listen("tcp", ":46920")
	if err != nil {
		panic("Error starting server")
	}
	conn, err := ln.Accept()
	if err != nil {
		panic("Could not accept connection")
	}
	defer conn.Close()

	for {

		Data, _ := bufio.NewReader(conn).ReadString('$')

		
		switch Data[0]{
		case '!':
			gamestartC <- formatToJSON(strings.TrimSuffix(Data[1:], "$"))
		case '?':
			req := make(chan int)
			playercountC <- req
			playercount := <-req
			conn.Write([]byte((strconv.Itoa(playercount))+"$"))
		case '#':
			playerlocC <- strings.TrimSuffix(Data[1:], "$")
		case 'X':
			StopC <- true
			break
		default:
			panic("Invalid TCP Packet")
			
		}}

}


func formatToJSON(data string) string {
	split := strings.Split(data, "/")
	maps := strings.TrimSpace(split[0])
	portals := strings.TrimSpace(split[1])

	

	print("\n###################\n")
	print(maps)
	print("\n###################\n")
	print(portals)
	print("\n###################\n")
	
	portals = strings.Split(portals, "\n")
	for i, portal := range portals {
		portals[i] = strings.Split(portal, "\n")
	}

	//return json.Marshal(datums)
	return data
}

func startHTTPServer(gamestartC chan string, playerlocC chan string, playercountC chan chan int){
	s := sse.NewServer(nil)
	defer s.Shutdown()

	http.Handle("/events/", s)
	box := packr.NewBox("./Web")
	http.Handle("/", http.FileServer(box))


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

func bufferPlayerLoc(playerLocInC chan string, playerLocOutC chan string){
	var LastLoc string = ""
	var loc string
	for {
		loc = <-playerLocInC
		if loc != LastLoc {
			playerLocOutC <- loc
		}
		LastLoc = loc
	}
}

func main(){
	gamestartC := make(chan string)
	playercountC := make(chan chan int)

	playerLocInC := make(chan string)
	playerLocOutC := make(chan string)

	StopC := make(chan bool)

	go startHTTPServer(gamestartC, playerLocOutC, playercountC)
	go startTCPServer(gamestartC, playerLocInC, playercountC, StopC)

	go bufferPlayerLoc(playerLocInC, playerLocOutC)

	select {
	case <-StopC:
		print("Stopping")
	}	
	
}






