# Frag Out!

![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white) 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)



A fun online multiplayer First Person Shooter game written in Javascript and Golang.

## Getting Started

Instructions to clone the project and host locally. If server is hosted locally, clients on local network can connect directly.

## Installation


### Frontend

Frontend is a simple Express app that servers the HTML, CSS and JS files. This step is necessariy as websocket connections from a locally stored files. Hence the files have to be hosted on localhost.

Run the following code to install Express and Nodejs
```
npm install
```

Now you can start the Express app using the following code.
```
node index.js
```

Now you can type the following in the URL of browser to play (replace <PORT> with the port you are running app on (8080 by default))
```
localhost:<PORT>/main.html
```
---

### Backend

Backend is a simple Golang web-server. 

Install go from https://go.dev/doc/install

Download and install the go's official websocket package
```
golang.org/x/net/websocket
```

To directly run the code, use the following command
```
go run server.go
```

To build the server (produces executable file), use the following command
```
go build server.go
```

Give firewall permissions to server.go if such a prompt appears.
