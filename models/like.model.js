import mongoose from "mongoose";

const likeSchema=new mongoose.Schema({
        userId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'User'},//UserId
        postId:{type:mongoose.Schema.Types.ObjectId,required:true,ref:'Post'},//PostId
    },{timestamps:true});

const Like=mongoose.model('Like',likeSchema);
export default Like;