import Internship from "../models/internship.model.js";

  // Get internships for a specific user
  export const getUserInternships = async (req, res) => {
    try {
      const { userId } = req.params;
      
      const internships = await Internship.find({ user: userId })
        .sort({ timePosted: -1 })
        .lean();
      res.status(200).json({ status: 'success', internships });
    } catch (error) {
      console.error('Get User Internships Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch internships' });
    }
  };

// Get all internships
export const getAllInternships = async (req, res) => {
    try {
      const internships = await Internship.find()
        .sort({ timePosted: -1 })
        .lean();
      res.status(200).json({ status: 'success', internships });
    } catch (error) {
      console.error('Get All Internships Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch internships' });
    }
  };

  // Create a new internship
  export const createInternship = async (req, res) => {
    try {
      const { title, company, location, description, requirements} = req.body;
      console.log("intern body :",req.body)
      if (!title || !company || !location || !description || !requirements) {
        return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
      }
      
      const newInternship = await Internship.create({...req.body,user:req.user._id});
      
      res.status(201).json({ status: 'success', internship: newInternship,message:"Internship added successfully" });
    } catch (error) {
      console.error('Create Internship Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create internship' });
    }
  };
  
  // Update an existing internship
  export const updateInternship = async (req, res) => {
    try {
      const { internshipId } = req.params;
      const updateData = req.body;
      
      const internship = await Internship.findById(internshipId);
      
      if (!internship) {
        return res.status(404).json({ status: 'error', message: 'Internship not found' });
      }
      
      // Check if user has permission to update this internship
      console.log(internship.user,req.user._id)
      if (internship.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to update this internship' });
      }
      
      const updatedInternship = await Internship.findByIdAndUpdate(
        internshipId,
        updateData,
        { new: true }
      );
      
      res.status(200).json({ status: 'success', internship: updatedInternship,message:"Internship data updated successfully!" });
    } catch (error) {
      console.error('Update Internship Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to update internship' });
    }
  };

    // Delete an internship
    export const deleteInternship = async (req, res) => {
        try {
          const { internshipId } = req.params;
          
          const internship = await Internship.findById(internshipId);
          
          if (!internship) {
            return res.status(404).json({ status: 'error', message: 'Internship not found' });
          }
          
          // Check if user has permission to delete this internship
          if (internship.user.toString() !== req.user.id.toString()) {
            return res.status(403).json({ status: 'error', message: 'Not authorized to delete this internship' });
          }
          
          await Internship.findByIdAndDelete(internshipId);
          
          res.status(200).json({ status: 'success', message: 'Internship deleted successfully' });
        } catch (error) {
          console.error('Delete Internship Error:', error);
          res.status(500).json({ status: 'error', message: 'Failed to delete internship' });
        }
      };

  