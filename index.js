var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
    console.log('socket connection');
    console.log(socket.id);
    socket.on('chat message', function(msgData){

        console.log(msgData);
        console.log("message from socketid " + socket.id);

        msgData.targets.forEach(function(tgt) {
            io.to(tgt).emit('directMessage', msgData.message);
        }, this);
    });

    socket.on('disconnect', () => {
        console.log("disconnect");
    });

    socket.on('login', (userName) => {
        console.log("login");
        console.log(userName);
        socket._userData = { name: userName, }        
        let userList = [];
        for(let p in io.sockets.sockets)
        {
            console.log(p);
            if((io.sockets.sockets[p]._userData !== undefined))
            {
                userList.push({ name: io.sockets.sockets[p]._userData.name,
                                socketId: io.sockets.sockets[p].id 
                              });
            }            
        }
        
        io.sockets.emit('userList', userList);
    })
})

http.listen(3000, function(){
  console.log('listeningg on *:3000');
});