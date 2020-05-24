const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const routes = express.Router()

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use('/chat', (req, res) => {
    res.render('chat.html');
});
app.use('/', (req, res) => {
    res.render('login.html')
});
let messages = [];

io.on('connection', socket => {
    console.log(`conectado, id:${socket.id}`);
    socket.join('sala')
    let { length } = socket.adapter.rooms['sala']
    console.log(length)
    socket.emit('usersOnline', length)
    socket.emit('previousMessage', messages)

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('recivedMessage', data);
    });
});

server.listen(process.env.PORT || 3000);