import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		type:{
			type:String,
			enum:['Provider','Seeker'],
			required:true
		},
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String},
		isEmailVarified:{type:Boolean,default:false},
		password: { type: String, required: true },
		profilePicture: {
			type: String,
			default: "",
		},
		otp:{type:String},
		otpExpiry: { type: Date },
		bannerImg: {
			type: String,
			default: "",
		},
		headline: {
			type: String,
			default: "Linkedin User",
		},
		location: {
			type: String,
			default: "Earth",
		},
		universityName:{
			type:String,
			default:''
		},
		bio:{
			type:String, //Sort description
		},
		about: {
			type: String,  //Detail description of user
			default: "",
		},
		skills: [{type:mongoose.Schema.Types.ObjectId,ref:'Skill'}],
		education:[{type:mongoose.Schema.Types.ObjectId,ref:'Education'}],
		certificate:[{type:mongoose.Schema.Types.ObjectId,ref:'Certificate'}],
		experience:[{type:mongoose.Schema.Types.ObjectId,ref:'Experience'}],
		courses:[{type:mongoose.Schema.Types.ObjectId,ref:'Course'}],
		connections: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
