const express = require("express");

const {
    createPerformance,
    getAWWPerformance,
    getPerformanceById
} = require("../controllers/performance.controller");

const router = express.Router();

router.post("/", createPerformance);

router.get("/aww/:awwId", getAWWPerformance);

router.get("/:id", getPerformanceById);

module.exports = router;