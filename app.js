const express = require('express');
const path = require('path')
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000

app.use(express.static(path.join(__dirname, '/../public')))

// serve static files
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/../public/views/chat.html')
})

// when users connect
io.on('connection', (socket) => {
    console.log('User connected!');

    // send welcome message to user
    // socket.emit('message', 'Welcome to ChatterBox')

    // receive message from users
    socket.on('userMessage', msg => {
        // broadcast received message to everyone
        socket.broadcast.emit('message', msg)
    })
});

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});