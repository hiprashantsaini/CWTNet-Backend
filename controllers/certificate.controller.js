import Certificate from "../models/certificate.model.js";
import User from "../models/user.model.js";


// Get all certificates for a user
export const getUserCertificates = async (req, res) => {
    try {
        const {userId} = req.params;
  
      const certificates = await Certificate.find({ user_id: userId })
        .sort({ issue_date: -1 })
        .lean();
      res.status(200).json({ status: 'success', certificates });
    } catch (error) {
      console.error('Get User Certificates Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch certificates' });
    }
  };

// Create a new certificate
export const createCertificate = async (req, res) => {
    try {
      const userId = req.user._id;
      
      const newCertificate = {
        user_id: userId,
        title: req.body.title,
        issuer: req.body.issuer,
        issue_date: req.body.issue_date,
        expiration_date: req.body.expiration_date || null,
        credential_id: req.body.credential_id || '',
        credential_url: req.body.credential_url || '',
        description: req.body.description || '',
        visibility: req.body.visibility || 'public',
        image: req.body.image,
      };
  
      const certificate = await Certificate.create(newCertificate);

      await User.findByIdAndUpdate(userId,{$push:{certificate:certificate._id}});
  
      res.status(201).json({ status: 'success', certificate , message:"Certificate Added successfully"});
    } catch (error) {
      console.error('Create Certificate Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create certificate' });
    }
  };

  // Update certificate
export const updateCertificate = async (req, res) => {
  try {
    const certificateId=req.params.id;
    
    const updatedCertificate = {
      title: req.body.title,
      issuer: req.body.issuer,
      issue_date: req.body.issue_date,
      expiration_date: req.body.expiration_date || null,
      credential_id: req.body.credential_id || '',
      credential_url: req.body.credential_url || '',
      description: req.body.description || '',
      visibility: req.body.visibility || 'public',
      image: req.body.image,
    };

    const certificate = await Certificate.findByIdAndUpdate(certificateId,updatedCertificate,{new:true});

    res.status(201).json({ status: 'success', certificate , message:"Certificate Updated successfully"});
  } catch (error) {
    console.error('Update Certificate Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create certificate' });
  }
};

  // Delete certificate
  export const deleteCertificate = async (req, res) => {
    try {
      const certificateId=req.params.id;
  
      await Certificate.findByIdAndDelete(certificateId);
      await User.findByIdAndUpdate(req.user._id,{$pull:{certificate:certificateId}});

      res.status(201).json({ status: 'success',message:"Certificate deleted successfully"});
    } catch (error) {
      console.error('DeleteCertificate Certificate Error:', error);
      res.status(500).json({ status: 'error', message: 'Failed to create certificate' });
    }
  };
  