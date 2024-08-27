package main

import (
	"fmt"
	"io"
	"net/http"
	"strconv"

	"golang.org/x/net/websocket"
)

type Server struct{
	conns map[*websocket.Conn]int   //socket -> player , -1 in disconnected
	players map[int]*websocket.Conn  //map of playerId -> socket
	games map[int][10]*websocket.Conn           //map of gameId -> playerId
	numberOfplayers int 
}

func NewServer() *Server{
	return &Server{
		conns: make(map[*websocket.Conn]int),
		players: make(map[int]*websocket.Conn),
		games: make(map[int][10]*websocket.Conn),
		numberOfplayers: 0,
		
	}
}

func (server *Server) handleConnection(ws *websocket.Conn){
	fmt.Println("New Connection from ", ws.RemoteAddr());
	  

	playerId := server.numberOfplayers;
	gameId := server.numberOfplayers / 10;

	server.conns[ws] = playerId; 
	server.players[playerId] = ws; //playerId
	currentGame := server.games[gameId];
	currentGame[playerId % 10] = ws;
	server.games[gameId] = currentGame;
	//fmt.Println("Game Id -> ", gameId, "Player Id -> ", playerId, server.games[gameId]);
	
	ws.Write([]byte("WELCOME/" + strconv.Itoa(gameId) + "/" + strconv.Itoa(playerId)));
	server.numberOfplayers++;
	server.readLoop(ws);
}

func (server *Server) readLoop(ws *websocket.Conn){
	buff := make([]byte, 1024);
	
	for{
		n, err := ws.Read(buff);
		if err != nil {
			if err == io.EOF{
				break;
			}
			fmt.Println("Read Error", err);
			continue
		}
		msg := buff[:n];
		server.broadcast(msg, server.conns[ws]);
		
	}
}

func (server *Server) broadcast(msg []byte, sender int){
	fmt.Println("sending to other players....");
	playerId := sender;
	gameId := playerId / 10;
	currentGame := server.games[gameId];
	//fmt.Println(gameId, playerId, currentGame);

	for _, member := range currentGame{
		if member != nil && member != server.players[playerId]{
			//fmt.Println(server.conns[member]);
			member.Write(msg);
		}
	}
}

func main(){
	server := NewServer();
	fmt.Println("Listening for socket connection on ws://localhost:3003/ws");
	
	http.Handle("/", http.FileServer(http.Dir("../frontend")))
	http.Handle("/ws", websocket.Handler(server.handleConnection))
	http.ListenAndServe(":3000", nil);
	
}