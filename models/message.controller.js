import { getSocketUsers, io } from "../socket/socket.js";
import Chat from "./chat.model.js";
import Message from "./message.model.js";

const addMessage=async(req,res)=>{
    try {
        const {chatId,msgtext,users}=req.body;
        const message=await Message.create({
            sender:req.user._id,
            chat:chatId,
            content:msgtext,
        });
        console.log("addMessage users:",users);
       const data= getSocketUsers(users);
       const membersSocketIds=[];
       data.forEach((item)=>{
        if (item.userId.toString() !== req.user._id.toString()) {
            console.log(item.userId, "=", req.user._id);
            membersSocketIds.push(item.socketId)
          }

       })
       membersSocketIds.forEach((socketId)=>{
        io.to(socketId).emit('addedNewMessage',{
             message
       })
       })
       console.log("membersSocketIds :",membersSocketIds);
        await Chat.findByIdAndUpdate({_id:chatId},{$push:{latestMessage:message._id}});
        res.status(201).json({status:"success",message});
        
    } catch (error) {
        console.log("addMessage :",error);
        res.status(500).json({status:'error',message:"Internal server error"});
    }
}

const updateMessage=async(req,res)=>{
    try {
        const {msgId,msgtext,users}=req.body;

        const message=await Message.findByIdAndUpdate(msgId,{$set:{content:msgtext}},{new:true});

        console.log("updateMessage users:",users);
       const data= getSocketUsers(users);
       const membersSocketIds=[];
       data.forEach((item)=>{
        if (item.userId.toString() !== req.user._id.toString()) {
            console.log(item.userId, "=", req.user._id);
            membersSocketIds.push(item.socketId)
          }

       })
       membersSocketIds.forEach((socketId)=>{
        io.to(socketId).emit('updateMessage',{
             message
       })
       })
       console.log("membersSocketIds :",membersSocketIds);
        res.status(201).json({status:"success",message});
        
    } catch (error) {
        console.log("updateMessage :",error);
        res.status(500).json({status:'error',message:"Internal server error"});
    }
}

const deleteMessage=async(req,res)=>{
    try {
        const {msgId}=req.params;
        const {chatId,users}=req.body;
        const message=await Message.findByIdAndDelete(msgId);

        const data= getSocketUsers(users);
        const membersSocketIds=[];
        data.forEach((item)=>{
         if (item.userId.toString() !== req.user._id.toString()) {
             console.log(item.userId, "=", req.user._id);
             membersSocketIds.push(item.socketId)
           }
 
        })
        membersSocketIds.forEach((socketId)=>{
         io.to(socketId).emit('deleteMessage',{
              message
        })
        })

        await Chat.findByIdAndUpdate({_id:chatId},{$pull:{latestMessage:data._id}});
        res.status(201).json({status:"success"});
    } catch (error) {
        console.log("deleteMessage :",error);
        res.status(500).json({status:'error',message:"Internal server error"});
    }
}

const getMessages = async (req, res) => {
    try {
        // Step 1: Find all chats the user is part of
        const userId = req.user._id;
        const chats = await Chat.find({ users:userId,isGroupChat:false}).populate('users', 'name profilePicture');
        // Step 2: Fetch the latest message for each chat
        const latestMessages = await Promise.all(
            chats.map(async (chat) => {
                const message = await Message.findOne({ chat: chat._id })
                    .populate('sender', 'name profilePicture')
                    .sort({ createdAt: -1 });

                return {
                    chatId: chat._id,
                    chatName: chat.isGroupChat ? chat.chatName : chat.users.find(user => user._id.toString() !== userId.toString()).name,
                    profilePicture: chat.isGroupChat ? null : chat.users.find(user => user._id.toString() !== userId.toString()).profilePicture,
                    latestMessage: message ? {
                        msg_id: message._id,
                        senderName: message.sender.name,
                        profilePicture: message.sender.profilePicture,
                        message: message.content,
                        date: message.createdAt,
                    } : null,
                };
            })
        );
        res.status(200).json({
            status: 'success',
            chats: latestMessages.filter((msg)=>msg.latestMessage !== null),
        });
    } catch (error) {
        console.log("getMessages :", error);
        res.status(500).json({ status: 'error', message: "Internal server error" });
    }
};


export {
    addMessage, deleteMessage, getMessages, updateMessage
};

