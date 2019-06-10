const app = require('express')();
const PORT = process.env.PORT || 5000
const express = require('express');
const bodyParser = require('body-parser')
const server = require('http').Server(app);
const io = require('socket.io')(server);
const request = require('request');
app.use(bodyParser.urlencoded({
    extended: true
}));
//Allow use of static assets. 
//Included below line to allow referring to relative path in index.html
app.use(express.static('public'));
/*Data Endpoints Start*/
app.post('/issue/description/:issueId', function (req, res) {
    const url = "http://" + getUserName(req) + ":" + getPassword(req) + "@<$jira-url$>/rest/api/2/issue/" + getIssueId(req);
    request({ url: url }, function (err, response, body) {
    	var responseData = {};
    	responseData.statusCode = response.statusCode;
        if(response.statusCode == 200){
        	responseData.data =  JSON.parse(body).fields.description;
        	console.log(JSON.parse(body).fields.description);
        }
        else{
        	responseData.data = '';
        }
        res.send(responseData);
    });
});
app.post('/login', function (req, res) {
    const url = "https://" + getUserName(req) + ":" + getPassword(req) + "@<$stash-url$>/rest/api/1.0/users/" + getUserName(req);
    request({ url: url }, function (err, response, body) {
        const data = {statusCode: response.statusCode, data: body};
        console.log(data);
        res.send(data);
    })
});
/*Data Endpoints End*/
function getUserName(req) {
    console.log(req.body.username);
    return req.body.username;
}
function getPassword(req) {
    console.log(req.body.password);
    return req.body.password;
}
function getIssueId(req) {
    console.log(req.params.issueId);
    return req.params.issueId;
}
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
//Home
app.get('/view/home', function (req, res) {
    res.sendFile(__dirname + '/public/views/home.html');
});
app.get('/home', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
//Login
app.get('/view/login', function (req, res) {
    res.sendFile(__dirname + '/public/views/login.html');
});
app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
//Login
app.get('/view/error', function (req, res) {
    res.sendFile(__dirname + '/public/views/error.html');
});
app.get('/error', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
//Play
app.get('/view/play', function (req, res) {
    res.sendFile(__dirname + '/public/views/play.html');
});
app.get('/play', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/play/:sessionId', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

//Socket Handling
var users = [];

var sessions = {};

server.listen(PORT, () => console.log(`Listening on ${ PORT }`))

io.sockets.on('connection', function (socket) {
    socket.on('create-session', function (sessionId) {
        sessions[sessionId] = {cardData : [1, 2, 3, 8, 15, 23], storyID: 'ABC-123', storyDesc: 'As a user, I want my planning poker game to look as cool as Planning Poker!'};
        console.log(sessions);
    });
    socket.on('change-story', function (data) {
        sessions[socket.sessionId].storyID = data.id;
        sessions[socket.sessionId].storyDesc = data.desc;
        io.sockets.in(socket.sessionId).emit('change-story', data);
    });
    socket.on('join-session', function (data) {
        console.log(data);
        socket.sessionId = data.sessionId;
        socket.userName = data.userName;
        users.push(data);
        socket.join(data.sessionId);
        //Send to everyone connected that new user joined
        io.sockets.in(socket.sessionId).emit('notify-users', data);
        //Send All users to newly added user
        socket.emit('session-users', users.filter((user) => user.sessionId == socket.sessionId));

        socket.emit('change-card-values', sessions[socket.sessionId].cardData);
        const storyData = {id: sessions[socket.sessionId].storyID, desc: sessions[socket.sessionId].storyDesc};
        socket.emit('change-story', storyData);
        
    });
    socket.on('message', function (data) {
        io.sockets.in(socket.sessionId).emit('message', socket.userName, data);
    });
    socket.on('save-score-user', function (data) {
        console.log('save-score-user');
        console.log(socket.sessionId);
        console.log(socket.userName);
        console.log(users);
        console.log(data);
        users.forEach((item) => {
            if (item.sessionId == socket.sessionId && item.userName == socket.userName) {
                item.score = data;
            }
        });
        console.log('complete----')
        console.log(users);
        io.sockets.in(socket.sessionId).emit('play-complete', socket.userName);
    });
    socket.on('reveal-all', function () {
        io.sockets.in(socket.sessionId).emit('reveal-all', users.filter((user) => user.sessionId == socket.sessionId));
    });
    socket.on('reset-scores', function () {
        var filteredUsers = users.filter((user) => user.sessionId == socket.sessionId);
        filteredUsers.forEach((user) => {
            user.score = 0;
        });
        io.sockets.in(socket.sessionId).emit('reset-scores', filteredUsers);
    });
    socket.on('change-card-values', function (data) {
        sessions[socket.sessionId].cardData = data;
        io.sockets.in(socket.sessionId).emit('change-card-values', data);
    });
    socket.on('disconnect', function () {
        delete users[socket.userName];
        socket.emit('notify-room', socket.user + 'has left');
        socket.leave(socket.sessionId);
    });
});
