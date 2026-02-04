import Event from '../models/event.model.js';


const createEvent = async (req, res) => {
  try {
    const {coverImage,eventType,eventName,startDate,startTime,endDate,endTime,externalLink,description,hostName,type} = req.body;
    const userId=req.user._id;
    if(!eventType || !eventName || !startDate || !startTime || !hostName){
      return res.status(401).json({status:"fail",message:"Something is missing!"});
    }
    const newEvent = new Event({
      coverImage,
      eventType,
      eventName,
      startDate,
      startTime,
      endDate,
      endTime,
      externalLink,
      description,
      hostName,
      type,
      user:userId
    });

    const savedEvent = await newEvent.save();

    res.status(201).json({status:"success",message:"Event added successfully",event: savedEvent});
  } catch (error) {
    console.log("createEvent :",error.message);
    res.status(500).json({status:'error',message:'Internal server error'});
  }
};

const updateEvent = async (req, res) => {
  try {
    const {coverImage,eventType,eventName,startDate,startTime,endDate,endTime,externalLink,description,hostName,type} = req.body;
    const eventId=req.params.eventId;
    const userId=req.user._id;
    if(!eventType || !eventName || !startDate || !startTime || !hostName){
      return res.status(401).json({status:"fail",message:"Something is missing!"});
    }

    const event =await Event.findByIdAndUpdate(eventId,{$set:{coverImage,eventType,eventName,startDate,startTime,endDate,endTime,externalLink,description,hostName,type,user:userId}},{new:true});

    res.status(201).json({status:"success",message:"Event Updated successfully",event: event});
  } catch (error) {
    console.log("updateEvent :",error.message);
    res.status(500).json({status:'error',message:'Internal server error'});
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getEventDetail = async (req, res) => {
  try {
    const eventId=req.params.eventId;
    const event = await Event.findById(eventId).populate('participants','-password');
    res.status(200).json({status:"success",event});
  } catch (error) {
    res.status(500).json({status: "error",message: "Internal server error"});
  }
};

const deleteEvent = async (req, res) => {
  try {
    const eventId=req.params.eventId;
    await Event.findByIdAndDelete(eventId);
    res.status(200).json({status:'success',message:"Event has been deleted successfully"});
  } catch (error) {
    res.status(500).json({status:'error',message:"Internal server error"});
  }
};

const joinEvent = async (req, res) => {
  try {
    const { status } = req.body; // `status=true` means join the event, `status=false` means exit the event
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Handle joining the event
    if (status) {
      // Check if the user is already a participant
      if (event.participants.includes(req.user._id)) {
        return res.status(400).json({ message: 'You have already joined this event' });
      }
      // Add the user to the participants list
      event.participants.push(req.user._id);

      // Uncomment if maxParticipants is required
      // if (event.participants.length > event.maxParticipants) {
      //   return res.status(400).json({ message: 'Event is full' });
      // }
      const savedEvent = await event.save();
      return res.status(201).json({status: 'success',message: 'You have successfully joined this event',event: savedEvent,});
    }

    // Handle exiting the event
    if (!event.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'You have already exited this event' });
    }

    // Remove the user from the participants list
    event.participants.pull(req.user._id);
    const savedEvent = await event.save();
    return res.status(201).json({status: 'success',message: 'You have successfully exited this event',event: savedEvent,});
  } catch (error) {
    console.error('joinEvent error:', error);
    return res.status(500).json({
      message: error.message || 'An unexpected error occurred',
    });
  }
};


export { createEvent, deleteEvent, getAllEvents, getEventDetail, joinEvent, updateEvent };

