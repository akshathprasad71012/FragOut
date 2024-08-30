package main

import (
	"fmt"
	"io"
	"net/http"
	"strconv"

	"golang.org/x/net/websocket"
)

type Server struct{
	games map[int][10]*websocket.Conn           //map of gameId -> websockets
	sock_games map[*websocket.Conn]int          //map of websockets -> gameId
	sock_playerId map[*websocket.Conn]int       //map of websockets => playerId
	sock_index map[*websocket.Conn]int
	numberOfplayers int 
}

func NewServer() *Server{
	s := Server{
		games: make(map[int][10]*websocket.Conn),
		sock_games: make(map[*websocket.Conn]int),
		sock_playerId: make(map[*websocket.Conn]int),
		sock_index: make(map[*websocket.Conn]int),
		numberOfplayers: 0,
	}
	return &s;
	
}

func (server *Server) handleConnection(ws *websocket.Conn){
	fmt.Println("New Connection from ", ws.RemoteAddr());
	  

	playerId := server.numberOfplayers;
	server.sock_playerId[ws] = playerId;
	vacancyFound := false
	for gameId, clientArr := range server.games{
		for i, element := range clientArr{
			if element == nil{
				clientArr[i] = ws;
				server.games[gameId] = clientArr;
				server.sock_games[ws] = gameId;
				server.sock_index[ws] = i;
				vacancyFound = true;
				break;
			}
			if vacancyFound {
				break;
			}
		}
	}

	if !vacancyFound {
		game := server.games[server.numberOfplayers/10];
		game[0] = ws;
		server.games[server.numberOfplayers/10] = game;
		server.sock_games[ws] = server.numberOfplayers/10;
		server.sock_playerId[ws] = server.numberOfplayers;
		server.sock_index[ws] = 0;
	}
	// fmt.Println(server.games, server.sock_games);

	
	ws.Write([]byte("WELCOME/" + strconv.Itoa(server.sock_games[ws]) + "/" + strconv.Itoa(playerId)));
	
	server.numberOfplayers++;
	server.readLoop(ws);
}

func (server *Server) readLoop(ws *websocket.Conn){
	buff := make([]byte, 1024);
	
	for{
		n, err := ws.Read(buff);
		if err != nil {
			if err == io.EOF{
				gameId := server.sock_games[ws];
				i := server.sock_index[ws];
				game := server.games[gameId];
				game[i] = nil;
				server.games[gameId] = game;
				delete(server.sock_games, ws);
				delete(server.sock_playerId, ws);
				delete(server.sock_index, ws);
				// fmt.Println(server.games, server.sock_games);
				break;
			}
			fmt.Println("Read Error", err);
			continue
		}
		msg := buff[:n];
		server.broadcast(msg, server.sock_playerId[ws], server.sock_games[ws]);
		
	}
}

func (server *Server) broadcast(msg []byte, playerId int, gameId int){
	// fmt.Println("sending to other players....");
	currentGame := server.games[gameId];
	// fmt.Println(gameId, playerId, currentGame);

	for _, member := range currentGame{
		if member != nil && server.sock_playerId[member] != playerId{
			//fmt.Println(server.conns[member]);
			member.Write(msg);
		}
	}
}

func main(){
	server := NewServer();
	fmt.Println("Listening for socket connection on ws://localhost:3000/ws");
	
	http.Handle("/", http.FileServer(http.Dir("../frontend")))
	http.Handle("/ws", websocket.Handler(server.handleConnection))
	http.ListenAndServe(":3000", nil);
	
}