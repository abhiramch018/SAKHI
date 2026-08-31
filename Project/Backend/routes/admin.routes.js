const express = require("express");

const {
    getDashboardData,
    getAWWDetails
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/dashboard", getDashboardData);

router.get("/aww/:awwId", getAWWDetails);

module.exports = router;