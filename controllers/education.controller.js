import Education from "../models/education.model.js";
import User from "../models/user.model.js";

// Helper function to format education data
const formatEducationData = (data) => {
    return {
      ...data,
      activities: data.activities?.filter(activity => activity.trim() !== '') || [],
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
    };
  };

  // Add new education
export const addEducation = async (req, res) => {
    try {
      const userId = req.user._id; // Assuming you have auth middleware that sets req.user
  
      const educationData = formatEducationData({
        ...req.body,
        user: userId
      });
  
      const education = new Education(educationData);
      const data=await education.save();

      await User.findByIdAndUpdate(userId,{$push:{education:data._id}});
  
      res.status(201).json({status:"success",education,message: 'Education added successfully'});
  
    } catch (error) {
      console.error('Add Education Error:', error);
      res.status(500).json({status:'error', message: 'Failed to add education'});
    }
  };


  // Update education
export const updateEducation = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
  
      // Check if education exists and belongs to user
      const existingEducation = await Education.findOne({
        _id: id,
        user: userId
      });
  
      if (!existingEducation) {
        return res.status(404).json({status:"fail",message: 'Education not found or unauthorized'});
      }
  
      const educationData = formatEducationData(req.body);
  
      const updatedEducation = await Education.findByIdAndUpdate(
        id,
        { $set: educationData },
        { new: true, runValidators: true }
      );
  
      res.status(200).json({status:"success",education: updatedEducation,message: 'Education updated successfully'});
  
    } catch (error) {
      console.error('Update Education Error:', error);
      res.status(500).json({status:"error",message: 'Failed to update education'});
    }
  };

  // Get all education entries for a user
export const getUserEducation = async (req, res) => {
    try {
      const {userId} = req.params;
  
      const education = await Education.find({ user: userId })
        .sort({ startDate: -1 })
        .lean();
  
      res.status(200).json({status:'success',educations:education});
  
    } catch (error) {
      console.error('Get Education Error:', error);
      res.status(500).json({status:"error",message: 'Failed to fetch education'});
    }
  };

  // Delete education
export const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const result = await Education.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!result) {
      return res.status(404).json({status:"fail",message: 'Education not found or unauthorized'});
    }

    await User.findByIdAndUpdate(userId,{$pull:{education:id}});

    res.status(200).json({status:"success",message: 'Education deleted successfully'});

  } catch (error) {
    console.error('Delete Education Error:', error);
    res.status(500).json({status:"error",message: 'Failed to delete education'});

  }
};