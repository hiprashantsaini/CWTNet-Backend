import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimizes lookups by user_id
    },
    skill_name: {
      type: String,
      required: true,
      trim: true,
      index: true, // Improves searchability
    },
    endorsements: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        endorsed_at: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const Skill = mongoose.model("Skill", SkillSchema);
export default Skill;
