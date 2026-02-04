import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
const app=express();
const server=http.createServer(app);

const io=new Server(server,{
    cors:{
        origin:'http://localhost:5173',
        // origin:'https://astralearnweb.onrender.com',
        methods:['GET','POST'],
        credentials:true
    }
});

const connectedUsers=new Map();

const getSocketUsers=(users)=>{
    console.log("connectedUsers :",connectedUsers.keys());
   
   const chatUsers = Array.from(connectedUsers).filter(([key, value]) =>
    users.some(user => user._id === key)
  );
 
    return chatUsers.map(([key,value])=>({userId:key,socketId:value.socketId}));
}

// Helper function to broadcast online users
const broadcastOnlineUsers = () => {
    const onlineUsers = Array.from(connectedUsers).map(([key, value]) => ({
        userId: key,
        socketId: value.socketId,
        name: value.name,
        email: value.email,
        profilePicture: value.profilePicture
    }));
    
    io.emit('onlineUsers', onlineUsers);
}

export const getAllLiveUsers=(req,res)=>{
    const onlineUsers = Array.from(connectedUsers).map(([key, value]) => ({
        userId: key,
        socketId: value.socketId,
        name: value.name,
        email: value.email,
        profilePicture: value.profilePicture
    }));

   res.status(200).json({status:'success',onlineUsers});
}

io.on('connection',(socket)=>{
    console.log("socket started :socket Id :",socket.id)
    socket.on('setup',(userData)=>{
        console.log(`User setup for: ${userData._id}`);
        connectedUsers.set(userData._id,{...userData,socketId:socket.id});
        socket.join(userData._id);
        socket.emit('connected');

        broadcastOnlineUsers();
    });

   socket.on('disconnect',()=>{
    console.log(`User disconnect`);
    connectedUsers.forEach((item,key)=>{
        if(item.socketId===socket.id){
            connectedUsers.delete(key);

            broadcastOnlineUsers();
        }
    })
   })
})


export {
    app, getSocketUsers, io, server
};

