const Helper = require('./helper');
const MesssageDB = require('../models/message');
const UnreadDB = require('../models/unread');


const liveUser = async(socketId,user)=>{
    user['socketId'] = socketId;
    Helper.set(socketId,user._id);
    Helper.set(user._id,user);
}

const initalization = async(io,socket)=>{
    socket['currentUserId'] =socket.userData._id;
    await liveUser(socket.id,socket.userData);

    socket.on("message",data => incomingMessage(io,socket,data));
    socket.on("unreads",data => loadunreadMsg(socket));
    socket.on("loadmore",obj => loadmore(socket,obj));
}

const loadmore = async(socket,obj)=>{
    const limitMsg = process.env.MSG_LIMIT;
    const skip = Number(obj.page) ==1 ? 0 : Number(obj.page) -1;
    const skipCount = skip * limitMsg;
    let messages = await MesssageDB.find({
        $or : [
            {from:socket.currentUserId},
            {to:socket.currentUserId}
        ]
    }).sort({"created_at":-1}).skip(skipCount).limit(limitMsg).populate('from to','name _id');
    socket.emit("messages",messages)
}

const loadunreadMsg =  async(socket)=>{
    let unreads = await UnreadDB.find({to:socket.currentUserId});
    if(unreads.length > 0){
        unreads.forEach(async(unread) => {
           await UnreadDB.findByIdAndDelete(unread._id);
        })
    }
    socket.emit("unreads",{msg:unreads.length});
}

const incomingMessage = async(io,socket,data)=>{
    const MessageSave = await new MesssageDB(data).save();
    const messageResult = await MesssageDB.findById(MessageSave._id).populate('from to','name _id');
    // console.log(messageResult);
    const toUser = await Helper.get(messageResult.to._id);
    // console.log(toUser);
    if(toUser){
        const toSocket = io.of('/chat').to(toUser.socketId);
        // console.log(toUser.socketId);
        if(toSocket){
            toSocket.emit('message',messageResult)
        }else{
            next(new Error("Socket user is not found"));
        }
    }else{
        await new UnreadDB({from:messageResult.from._id,to:messageResult.to._id}).save();
    }
    socket.emit("message",messageResult);
    
}

module.exports = {
    initalization
}