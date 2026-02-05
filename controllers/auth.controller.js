import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";

import dotenv from 'dotenv';

dotenv.config();

const transporter=nodemailer.createTransport({
	 host:"smtp.gmail.com",
	 port:587,
	 secure:false,
	 auth:{
		user:process.env.SMTP_USER,
		pass:process.env.SMTP_PASS
	 },
});

const sendOTPEmail=async(email,otp)=>{
	const mailOptions={
        from:process.env.SMTP_USER,
		to:email,
		subject:"Your Password Reset OTP",
		html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>
		<p>This OTP is valid for 5 minutes.</p>`,
	}

	await transporter.sendMail(mailOptions);
}

const client=new OAuth2Client(process.env.GOOGLE_CLOUD_CONSOLE_CLIENT_ID);

export const googleSignIn = async (req, res) => {
    const { type } = req.body;
	const googleToken=req.body.token;

	console.log("googleToken :",googleToken)

    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLOUD_CONSOLE_CLIENT_ID,
        });

        const { name, email, picture } = ticket.getPayload();
        console.log("ticket.getPayload :",)
		let user = await User.findOne({ email });
		console.log("User :",user);
        if (!user) {

			if(!['Provider','Seeker'].includes(type)){
				return res.status(400).json({ message: "missedProfileType"});
			}
            const username = email.split("@")[0] + Math.floor(Math.random() * 1000);
            const hashedPassword = await bcrypt.hash(email + process.env.JWT_SECRET, 10); // Dummy password

            user = new User({
                name,
                email,
                username,
                type, // Either "Provider" or "Seeker" (sent from frontend)
                password: hashedPassword,
                profilePicture: picture,
            });

           await user.save();
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
		res.cookie("jwt-linkedin", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: "strict", // prevent CSRF attacks,
			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
		});

        res.status(200).json({ message:"You are loggedIn suucessfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Google Sign-In failed" });
    }
};

// Generate a random 6-digit OTP
const generateOtp=()=>{
	let otp=Math.floor(100000+Math.random()*900000).toString();
	return otp;
}

const sendEmailAuthenticationOtp=async(email,otp)=>{
	const mailOptions={
		from:process.env.SMTP_USER,
		to:email,
		subject: 'Email Verification OTP',
		html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 2px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `};
	await transporter.sendMail(mailOptions);
}

export const sendOtpForEmail=async(req,res)=>{
	try {
		const {email}=req.body;
		const existingUser = await User.findOne({ email, isEmailVerified: true });
		if(existingUser){
			return res.status(400).json({ message: 'Email already registered' });
		}

		const otp=generateOtp();

		//save otp to database
		await OTP.findOneAndUpdate({email},{email,otp},{upsert:true,new:true});

		//send email
		await sendEmailAuthenticationOtp(email,otp);

		res.status(200).json({ message: 'OTP sent successfully. Check your email'});

	} catch (error) {
		console.error('Send OTP error:', error);
		res.status(500).json({ message: 'Failed to send OTP' });
	}
};

export const verifyOtpForEmail=async(req,res)=>{
	try {
		const {email,otp}=req.body;

		const storedOTP=await OTP.findOne({email,otp});

		if (!storedOTP) {
			return res.status(400).json({ message: 'Invalid OTP' });
		}

		// Delete the used OTP
		await OTP.deleteOne({ email, otp });

		res.status(200).json({ message: 'OTP verified successfully' });

	} catch (error) {
		console.error('verifyOtpForEmail:', error);
		res.status(500).json({ message: 'Failed to verify OTP. Try again' });
	}
}

export const signup = async (req, res) => {
	try {
		const { name, username, email, password,type } = req.body;
        
		if(!['Provider','Seeker'].includes(type)){
			return res.status(400).json({ message: "Profile type required!" });
		}

		if (!name || !username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}
		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ message: "Email already exists" });
		}

		const existingUsername = await User.findOne({ username });
		if (existingUsername) {
			return res.status(400).json({ message: "Username already exists" });
		}

		if (password.length < 6) {
			return res.status(400).json({ message: "Password must be at least 6 characters" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User({
			name,
			email,
			password: hashedPassword,
			username,
			type,
			isEmailVerified: true
		});

		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

		res.cookie("jwt-linkedin", token, {
			httpOnly: true, // prevent XSS attack
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "strict", // prevent CSRF attacks,
			secure: process.env.NODE_ENV === "production", // prevents man-in-the-middle attacks
		});

		res.status(201).json({ message: "User registered successfully" });

		const profileUrl = process.env.CLIENT_URL + "/profile/" + user.username;

		try {
			await sendWelcomeEmail(user.email, user.name, profileUrl);
		} catch (emailError) {
			console.error("Error sending welcome Email", emailError);
		}
	} catch (error) {
		console.log("Error in signup: ", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if user exists
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		// Create and send token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
		await res.cookie("jwt-linkedin", token, {
			httpOnly: true,
			maxAge: 3 * 24 * 60 * 60 * 1000,
			sameSite: "none",
			secure: true,
		});

		res.json({ message: "Logged in successfully" });
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};



export const logout = (req, res) => {
	res.clearCookie("jwt-linkedin");
	res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req, res) => {
	try {
		const userData=await User.findById({_id:req.user._id}).select('-password').populate('connections', '-password');
		// .populate('education')
		// .populate('certificate')
		// .populate('experience')
		// .populate('courses');
		// res.json(req.user);
		res.json(userData);
	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const sendOtp=async(req,res)=>{
	try {
		const {email}=req.body;
		const user=await User.findOne({email:email});
		if(!user){
			return res.status(401).json({status:'fail',message:"Account did not found."});
		}
		const otp=Math.floor(Math.random()*1000000).toString();
		user.otp=otp;
		//Expire otp in 5 minutes
		user.otpExpiry=Date.now()+ (5*60*1000);
		await user.save();

		await sendOTPEmail(email,otp);
		res.status(200).json({status:'success',message:"An otp is sent on your registered email."});

	} catch (error) {
		console.error("Error in getCurrentUser controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};


export const resetPassword=async(req,res)=>{
   try {
	  const {otp,email,newPassword}=req.body;
	  const user=await User.findOne({email:email});
	  if(!user || user.otp !== otp || user.otpExpiry < Date.now()) {
		return res.status(402).json({status:'fail',message:'Invalid or expired otp'});
	  }
      const salt = await bcrypt.genSalt(10);
	  const hashedPassword=await bcrypt.hash(newPassword,salt);
	  user.password=hashedPassword;
	  user.otp=undefined;
	  user.otpExpiry=undefined;
	  await user.save();
	  res.status(200).json({status:'success',message:"Your password updated successfully. Login now"});
   } catch (error) {
	console.error("Error in resetPassword controller:", error);
	res.status(500).json({ message: "Server error" });
   }
}
