const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const cors = require('cors');


// App config
app.use(cors());

// Socket connection
io.on('connection', socket => {
    console.log('New connection! With id: ' + socket.id);
    socket.questionsCount = 0;
    socket.on('message', ({ room, message, username, isGuess }) => {
        const newMessage = { username, content: message, isGuess };
        io.to(room).emit('message', newMessage);
    })
    socket.on('count question', room => {
        io.to(room).emit('question count', ++socket.questionsCount);
    })
    socket.on('new room', username => {
        // const newRoom = `room-${++num}`;
        socket.username = username;
        socket.join(socket.id);
        io.to(socket.id).emit('room created', { roomId: socket.id });
    })
    socket.on('join room', ({ roomId, username }) => {
        const rooms = io.sockets.adapter.rooms;
        if (rooms[roomId]) {
            if (rooms[roomId].length < 2) {
                socket.username = username;
                socket.join(roomId);
                socket.broadcast.to(roomId).emit('message', {
                    content: `User ${socket.username} joined`,
                    username: null
                });
            }
            else {
                socket.emit('full room', { msg: 'This room is full' });
            }
        }
        else {
            socket.emit('no existing room', { err: `Room ${roomId} doesn't exist` });
        }
    })
    socket.on('game over', ({ room, winner }) => {
        io.to(room).emit('winner', winner);
    })
});

http.listen(4443, () => {
    console.log('Listening on port 4443');
})
