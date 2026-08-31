const learningService = require("../services/learning.service");

const createCourse = async (req, res) => {
    try {
        const course = await learningService.createCourse(req.body);

        res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await learningService.getAllCourses();

        res.status(200).json({
            success: true,
            data: courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await learningService.getCourseById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const updateProgress = async (req, res) => {
    try {
        const progress = await learningService.updateProgress(
            req.params.awwId,
            req.params.courseId,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Learning progress updated",
            data: progress
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAWWProgress = async (req, res) => {
    try {
        const progress = await learningService.getAWWProgress(
            req.params.awwId
        );

        res.status(200).json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateProgress,
    getAWWProgress
};