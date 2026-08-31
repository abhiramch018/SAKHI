const express = require("express");

const {
    evaluateDecisionTree
} = require("../controllers/decisionTree.controller");

const router = express.Router();

router.post("/evaluate", evaluateDecisionTree);

module.exports = router;