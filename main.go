package main

import (
	"net/http"
	"strconv"
	"strings"
	"bufio"
	"net"
	"github.com/gobuffalo/packr"
	"github.com/alexandrevicenzi/go-sse"
	"io"
)


func startTCPServer(gamestartC chan string, playerlocC chan string, playercountC chan chan int, StopC chan bool){
	ln, err := net.Listen("tcp", ":46920")
	if err != nil {
		panic("Error starting server")
	}
	for {
		conn, err := ln.Accept()
		if err != nil {
			panic("Could not accept connection")
		}
		go handleConnection(conn, gamestartC, playerlocC, playercountC, StopC)
	}

}

func handleConnection(conn net.Conn, gamestartC chan string, playerlocC chan string, playercountC chan chan int, StopC chan bool){

	defer conn.Close()

	for {
	
		Data, _ := bufio.NewReader(conn).ReadString('$')
		if len(Data) >= 1 {
			switch Data[0]{
			case '!':
				gamestartC <- formatToJSON(strings.TrimSuffix(Data[1:], "$"))
			case '?':
				req := make(chan int)
				playercountC <- req
				playercount := <-req
				conn.Write([]byte("?"+strconv.Itoa(playercount)+"$"))
			case '#':
				playerlocC <- strings.TrimSuffix(Data[1:], "$")
			case 'X':
				StopC <- true
				break
			default:
				panic("Invalid TCP Packet")
				
			}
		} else {break}
	}
}


func makeIDs(output chan chan int) func(http.ResponseWriter, *http.Request) {
    return func(w http.ResponseWriter, r *http.Request) {
		ch := make(chan int)
		output <- ch
		num := <-ch
        io.WriteString(w, strconv.Itoa(num))
    }
}
func genIDs(input chan bool, output chan chan int){
	num := 0
	for{
		select {
		case <-input:
			num = 0
		case ch := <-output:
			num++
			ch <- num
		}
	}
}

func startHTTPServer(gamestartC chan string, playerlocC chan string, playercountC chan chan int){
	s := sse.NewServer(nil)
	defer s.Shutdown()

	http.Handle("/events/", s)
	box := packr.NewBox("./Web")
	http.Handle("/", http.FileServer(box))

	input := make(chan bool)
	output := make(chan chan int)

	handleIDs := makeIDs(output)
	go genIDs(input, output)
	http.HandleFunc("/id", handleIDs)
	
	go http.ListenAndServe(":8080",		nil)

	for {
		select {
		case mapjson := <-gamestartC:
			input <- true
			s.SendMessage("/events/game", sse.SimpleMessage(mapjson))
		case playerlocation:=  <-playerlocC:
			s.SendMessage("/events/game", sse.SimpleMessage(playerlocation))
		case pcC := <-playercountC:
			k, err :=s.GetChannel("/events/game")
			var count int
			if err != true {
				print("Channel does not exist")
				count = 0
			} else {
				count = k.ClientCount()
			}
			pcC <- count
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

