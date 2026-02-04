import Skill from "../models/skill.model.js";
import User from "../models/user.model.js";

export const getSkills = async (req, res) => {
  try {
    const { userId } = req.params;
    const skills = await Skill.find({ userId }).sort({ created_at: -1 });

    res.status(200).json({status:"success",skills});
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const addSkill = async (req, res) => {
  try {

    const userId=req.user._id;
    const {skill_name } = req.body;

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ userId, skill_name });
    if (existingSkill) {
      return res.status(400).json({status:'fail', message: "Skill already exists" });
    }

    const skill = new Skill({ userId, skill_name });
    const skillData=await skill.save();

    await User.findByIdAndUpdate(userId,{$push:{skills:skillData._id}},{new:true});

    res.status(201).json({status:'success', message: "Skill added successfully", skill });
  } catch (error) {
    res.status(500).json({status:'error', message: "Server Error", error: error.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { skill_name } = req.body;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({status:'fail', message: "Skill not found" });
    }

    skill.skill_name = skill_name || skill.skill_name;
    await skill.save();

    res.status(200).json({status:'success', message: "Skill updated successfully", skill });
  } catch (error) {
    res.status(500).json({status:'error', message: "Could not update. Try again"});
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({status:'fail', message: "Skill not found" });
    }

    await skill.deleteOne();
    await User.findByIdAndUpdate(req.user._id,{$pull:{skills:skillId}},{new:true});
    res.status(200).json({status:'success', message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({status:'error', message: "Could not delete. Try again"});
  }
};

// @desc    Endorse a skill
// @route   POST /api/skills/:skill_id/endorse
// @access  Private
export const endorseSkill = async (req, res) => {
  try {
    const { skill_id } = req.params;
    const { user_id } = req.body; // User endorsing the skill

    const skill = await Skill.findById(skill_id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    // Check if already endorsed
    const alreadyEndorsed = skill.endorsements.some(
      (endorsement) => endorsement.user.toString() === user_id
    );
    if (alreadyEndorsed) {
      return res.status(400).json({ message: "Already endorsed this skill" });
    }

    skill.endorsements.push({ user: user_id });
    await skill.save();

    res.status(200).json({ message: "Skill endorsed successfully", skill });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
