import Experience from "../models/experience.model.js";
import User from "../models/user.model.js";


// Get all Experience for a user
export const getUserExperience = async (req, res) => {
    try {
        const {userId} = req.params;
  
      const experiences = await Experience.find({ user_id: userId })
        .sort({ updatedAt: -1 })
        .lean();
      res.status(200).json({ status: 'success', experiences });
    } catch (error) {
      console.error('Get User experience Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch experience' });
    }
  };

// Create a new Experience
export const createExperience = async (req, res) => {
    try {
      const userId = req.user._id;
      
      const newCertificate = {
        user_id: userId,
        job_title: req.body.job_title,
        company: req.body.company,
        location: req.body.location,
        start_date: req.body.start_date,
        end_date: req.body.end_date || null,
        description: req.body.description || '',
      };
      const experience = await Experience.create(newCertificate);

      await User.findByIdAndUpdate(userId,{$push:{experience:experience._id}});
  
      res.status(201).json({ status: 'success', experience , message:"Experience Added successfully"});
    } catch (error) {
      console.error('Create createExperience Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create Experience' });
    }
  };

  // Update Experience 
export const updateExperience = async (req, res) => {
  try {
    const experienceId=req.params.id;
    
    const updatedExperience = {
        job_title: req.body.job_title,
        company: req.body.company,
        location: req.body.location,
        start_date: req.body.start_date,
        end_date: req.body.end_date || null,
        description: req.body.description || '',
      };

    const experience = await Experience.findByIdAndUpdate(experienceId,updatedExperience,{new:true});

    res.status(201).json({ status: 'success', experience , message:"Experience Updated successfully"});
  } catch (error) {
    console.error('Update Experience  Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to update Experience ' });
  }
};

  // Delete Experience
  export const deleteExperience = async (req, res) => {
    try {
      const experienceId=req.params.id;
  
      await Experience.findByIdAndDelete(experienceId);
      await User.findByIdAndUpdate(req.user._id,{$pull:{experience:experienceId}});

      res.status(201).json({ status: 'success',message:"Experience deleted successfully"});
    } catch (error) {
      console.error('Delete Experience Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to delete experience' });
    }
  };
  