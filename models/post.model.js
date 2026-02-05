import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		content: { type: String },
		image: { type: String },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
		comments: [{
			user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			content: { type: String },
			createdAt: { type: Date, default: Date.now }
		}],
		visibility:{
			type:String,
			enum:['public','private'],
			default:'public'
		}
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;



