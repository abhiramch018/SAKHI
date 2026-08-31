const express = require("express");

const {
    createCourse,
    getAllCourses,
    getCourseById,
    updateProgress,
    getAWWProgress
} = require("../controllers/learning.controller");

const router = express.Router();

router.post("/courses", createCourse);

router.get("/courses", getAllCourses);

router.get("/courses/:id", getCourseById);

router.patch(
    "/progress/:awwId/:courseId",
    updateProgress
);

router.get(
    "/progress/:awwId",
    getAWWProgress
);

module.exports = router;