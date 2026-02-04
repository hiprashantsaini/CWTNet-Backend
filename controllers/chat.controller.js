import Chat from "../models/chat.model.js";

const accessChat = async (req, res) => {
    try {
        // used to either retrieve an existing one-on-one chat between two users or create a new chat if none exists
        const { userId } = req.body;
        console.log("userId :",userId)
        let chat = await Chat.findOne({ isGroupChat: false, users: { $all: [req.user._id, userId] } }).populate('users', '-password').populate('latestMessage');
        if (chat) {
            return res.status(200).json({chat,message: "Webcome back in your chat"});
        }

        // create a new chat 
        chat = await Chat.create({
            chatName: 'Sender',
            isGroupChat: false,
            users: [req.user._id, userId],
        });
        chat = (await chat.populate('users', '-password'));
        res.status(201).json({ chat: chat,message: "New chat started"});
    } catch (error) {
        console.log("accessChat :", error.message);
        res.status(500).json({ status: 'error', message: "Internal Server error!" });
    }
}

const createGroupChat = async (req, res) => {
    try {
        const { name, users } = req.body;
        if (!name || !users || users.length < 2) {
            return res.status(400).json({
              success: false,
              message: "Please provide group name and at least 2 users"
            });
          }
        const groupChat = await Chat.create({
            chatName: name,
            isGroupChat: true,
            users: [...users, req.user._id],
            groupAdmin: req.user._id
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id }).populate('users', '-password').populate('groupAdmin', '-password');
        res.status(201).json({ status: 'success', message: "Group has been created!", fullGroupChat });
    } catch (error) {
        console.log("createGroupChat :", error.message);
        res.status('500').json({ status: 'error', message: "Internal Server error!" });
    }
}

const fetchChats = async (req, res) => {
    try {
        const chats = await Chat.find({
            users: { $elemMatch: { $eq: req.user._id } }
        }).populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage')//latestMessages
            .sort({ updatedAt: -1 });

        res.status(200).json({status:'success',chats});
    } catch (error) {
        console.log("fetchChats :", error.message);
        res.status('500').json({ status: 'error', message: "Internal Server error!" });
    }
}

export {
  accessChat,
  createGroupChat,
  fetchChats
};
