import Course from "../models/course.Model.js";
import User from "../models/user.model.js";

// Get all courses for a user
export const getUserCourses = async (req, res) => {
    try {
        const {userId} = req.params;
        const courses = await Course.find({ provider_id: userId })
            .sort({ updatedAt: -1 })
            .lean();
        res.status(200).json({ status: 'success', courses });
    } catch (error) {
        console.error('Get User Courses Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch courses' });
    }
};

// Create a new course
export const createCourse = async (req, res) => {
    try {
        const userId = req.user._id;
        const newCourse = {
            provider_id: userId,
            title: req.body.title,
            description: req.body.description,
            short_description: req.body.short_description,
            category: req.body.category,
            subcategory: req.body.subcategory,
            tags: req.body.tags || [],
            level: req.body.level || 'all-levels',
            duration: req.body.duration,
            duration_hours: req.body.duration_hours || 0,
            price: req.body.price || 0,
            discounted_price: req.body.discounted_price || 0,
            currency: req.body.currency || 'USD',
            language: req.body.language || 'English',
            prerequisites: req.body.prerequisites || [],
            learning_outcomes: req.body.learning_outcomes || [],
            course_content: req.body.course_content || [],
            thumbnail: req.body.thumbnail || '',
            promotional_video: req.body.promotional_video || '',
            certificate_available: req.body.certificate_available || false,
            access_period: req.body.access_period || 'lifetime',
            status: req.body.status || 'draft'
        };
        const course = await Course.create(newCourse);
        await User.findByIdAndUpdate(userId, { $push: { courses: course._id } });
        res.status(201).json({ status: 'success', course, message: "Course Added successfully" });
    } catch (error) {
        console.error('Create Course Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to create course' });
    }
};

// Update course
export const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const updatedCourse = {
            title: req.body.title,
            description: req.body.description,
            short_description: req.body.short_description,
            category: req.body.category,
            subcategory: req.body.subcategory,
            tags: req.body.tags || [],
            level: req.body.level || 'all-levels',
            duration: req.body.duration,
            duration_hours: req.body.duration_hours || 0,
            price: req.body.price || 0,
            discounted_price: req.body.discounted_price || 0,
            currency: req.body.currency || 'USD',
            language: req.body.language || 'English',
            prerequisites: req.body.prerequisites || [],
            learning_outcomes: req.body.learning_outcomes || [],
            course_content: req.body.course_content || [],
            thumbnail: req.body.thumbnail || '',
            promotional_video: req.body.promotional_video || '',
            certificate_available: req.body.certificate_available || false,
            access_period: req.body.access_period || 'lifetime',
            status: req.body.status || 'draft'
        };
        const course = await Course.findByIdAndUpdate(courseId, updatedCourse, { new: true });
        res.status(200).json({ status: 'success', course, message: "Course Updated successfully" });
    } catch (error) {
        console.error('Update Course Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update course' });
    }
};

// Delete course
export const deleteCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        await Course.findByIdAndDelete(courseId);
        await User.findByIdAndUpdate(req.user._id, { $pull: { courses: courseId } });
        res.status(200).json({ status: 'success', message: "Course deleted successfully" });
    } catch (error) {
        console.error('Delete Course Error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to delete course' });
    }
};
