const express = require("express");

const {
    createMilestone,
    getAllMilestones,
    getAWWMilestone
} = require("../controllers/milestone.controller");

const router = express.Router();

router.post("/", createMilestone);

router.get("/", getAllMilestones);

router.get("/aww/:awwId", getAWWMilestone);

module.exports = router;