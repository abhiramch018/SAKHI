const express = require("express");

const {
    generateGuidance
} = require("../controllers/ai.controller");

const router = express.Router();

router.post("/guidance", generateGuidance);

module.exports = router;