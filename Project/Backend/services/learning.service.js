const Course = require("../models/Course");
const LearningProgress = require("../models/LearningProgress");

const createCourse = async (data) => {
    return await Course.create(data);
};

const getAllCourses = async () => {
    return await Course.find();
};

const getCourseById = async (id) => {
    const course = await Course.findById(id);

    if (!course) {
        throw new Error("Course not found");
    }

    return course;
};

const updateProgress = async (awwId, courseId, data) => {
    return await LearningProgress.findOneAndUpdate(
        {
            aww: awwId,
            course: courseId
        },
        {
            aww: awwId,
            course: courseId,
            completed: data.completed,
            quizScore: data.quizScore
        },
        {
            new: true,
            upsert: true,
            runValidators: true
        }
    );
};

const getAWWProgress = async (awwId) => {
    return await LearningProgress.find({
        aww: awwId
    }).populate("course");
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    updateProgress,
    getAWWProgress
};