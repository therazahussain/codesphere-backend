require('dotenv').config();
const express = require('express');
const { Server } = require('socket.io')
const http = require('http');
const cors = require('cors');
const bodyParser = require("body-parser");
const ACTIONS = require('./Action.js');
const app = express();
const codeRoute = require("./routes/codeOutputRoute.js");

// Middelware
const corsOption = {
    credentials: true,
    origin: ['https://illustrious-buttercream-7f37f3.netlify.app'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
};

app.use(cors(corsOption));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


// app.use(cors({
//   origin: 'https://illustrious-buttercream-7f37f3.netlify.app',
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type']
// }));


const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
});


// Route
app.use("/api", codeRoute);



const userSocketMap = {};

const getAllConnectedClients = (roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
        return {
            socketId,
            username: userSocketMap[socketId],
        }
    })
}


io.on('connection', (socket) => {

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    // Listning for Code Change
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Listning for code sync to all connected users in a room 
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // to sync the dropdown selection
    socket.on(ACTIONS.SYNC_DROPDOWN, ({ language, roomId }) => {
        socket.in(roomId).emit(ACTIONS.DROPDOWN_CHANGE, { language });
    });

    // if a user trigeer run command stop other connected users from running the code until you get the output. 
    socket.on(ACTIONS.RUN_TRIGGER, (roomId) => {
        socket.in(roomId).emit(ACTIONS.FREEZE_CHANGE);
    });

    // to sync the output to all conneted users.
    socket.on(ACTIONS.SEND_OUTPUT, ({ roomId, response }) => {
        socket.in(roomId).emit(ACTIONS.SET_OUTPUT, { response })
    })



    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
    });

    socket.on("send_output", (data) => {
        socket.broadcast.to(data.roomId).emit("receive_output", { data: "hii" });
    })

})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});