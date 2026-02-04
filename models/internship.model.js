import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    company: { type: String, required: true },
    logo: { type: String, required: false },
    logoColor: { type: String, required: false },
    location: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
    isFullTime: { type: Boolean, default: false },
    logoShape: { type: String, enum: ["rounded", "square", "rounded-full"], default: "square" },
    description: { type: String, required: true },
    requirements: { type: [String], required: true },
    salary: { type: String, required: false },
    duration: { type: String, required: false },
    timePosted: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);

export default Internship;
