import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import certificateRoutes from "./routes/certificate.route.js";
import chatRoutes from "./routes/chat.route.js";
import connectionRoutes from "./routes/connection.route.js";
import courseRoutes from "./routes/course.route.js";
import educationRoutes from "./routes/education.route.js";
import eventRoutes from "./routes/event.route.js";
import experienceRoutes from "./routes/experience.route.js";
import internshipRoutes from "./routes/internship.route.js";
import messageRoutes from "./routes/message.route.js";
import notificationRoutes from "./routes/notification.route.js";
import postRoutes from "./routes/post.route.js";
import skillRoutes from "./routes/skill.route.js";
import userRoutes from "./routes/user.route.js";


import { connectDB } from "./lib/db.js";
import { app, server } from "./socket/socket.js";
dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


app.use(
    cors({
        origin: process.env.URL,
        credentials: true,
    })
);


// app.use(cors({
//     origin: 'http://localhost:5173',  // Allow requests from frontend
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));

app.use(express.json({ limit: "5mb" })); // parse JSON request bodies
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/internship", internshipRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/skill", skillRoutes);
app.use("/api/v1/education", educationRoutes);
app.use("/api/v1/certificate", certificateRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/experience", experienceRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/connections", connectionRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});


// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "/frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});
