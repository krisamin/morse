const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 3000;

const fs = require('fs');
const path = require('path');

const cons = require('consolidate');
app.use(express.static(__dirname + '/public'));
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index');
});

io.on('connection', (socket) => {
  console.log('New connection');
  io.emit('userConnect', io.engine.clientsCount);

  socket.on('userDisconnect', () => {
    console.log('User disconnected');
    io.emit('disconnect', io.engine.clientsCount);
  });

  socket.on('key', (data) => {
    io.emit('key', data);
  });
});

server.listen(PORT, () => {
  console.log('Server is up on port ' + PORT);
});
