const express = require("express");

const {
    createRule,
    getAllRules,
    getRuleById,
    updateRule,
    deleteRule
} = require("../controllers/rule.controller");

const router = express.Router();

router.post("/", createRule);

router.get("/", getAllRules);

router.get("/:id", getRuleById);

router.put("/:id", updateRule);

router.delete("/:id", deleteRule);

module.exports = router;