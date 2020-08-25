let express                             =require("express"),
http                                    =require("http"),
path                                    =require("path"),
socket                                  =require("socket.io"),
{ generateMessage,generateLocation }    =require("./utils/messages"),    
{ addUser,removeUser,getUser,getAllUsers}=require("./utils/users");

let app =express(),
server  =http.createServer(app),
io      =socket(server),
dir     =path.join(__dirname,"../public");

app.use(express.static(dir));


////////////server socket script////////////////////////
io.on("connection",(socket)=>{
	console.log("new websocket connection");

    socket.on("join",({username,room},callback)=>{   
        let {error,user}=addUser({id:socket.id,username,room});
        if(error){
           return callback(error);
        }
        socket.join(user.room);
        socket.emit("message",generateMessage("Admin","welcome"));
        socket.broadcast.to(user.room).emit("message",generateMessage("Admin",user.username+ " has joined"));
        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getAllUsers(user.room)
        });
        callback();
    });

    socket.on("location",(coords)=>{
        let user=getUser(socket.id);
    	io.to(user.room).emit("locmessage",generateLocation(user.username,"https://www.google.co.in/maps/@coords[0],coords[1],19.15z"));
    });

    socket.on("input",(x)=>{
        let user=getUser(socket.id);
    	io.to(user.room).emit("message",generateMessage(user.username,x));
    });

    socket.on("disconnect",()=>{
        let user=removeUser(socket.id);
        if(user){
            io.to(user.room).emit("message",generateMessage("Admin",user.username+" has disconnectd brb"));
            io.to(user.room).emit("roomData",{
            room:user.room,
            users:getAllUsers(user.room)
        });
        };

    });

});

server.listen(3000,()=>{
 console.log("3000 up");
});
