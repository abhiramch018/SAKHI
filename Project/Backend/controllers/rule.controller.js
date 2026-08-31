const ruleService = require("../services/rule.service");

const createRule = async (req, res) => {
    try {
        const rule = await ruleService.createRule(req.body);

        res.status(201).json({
            success: true,
            message: "Rule created successfully",
            data: rule
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllRules = async (req, res) => {
    try {
        const rules = await ruleService.getAllRules();

        res.status(200).json({
            success: true,
            data: rules
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getRuleById = async (req, res) => {
    try {
        const rule = await ruleService.getRuleById(req.params.id);

        res.status(200).json({
            success: true,
            data: rule
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const updateRule = async (req, res) => {
    try {
        const rule = await ruleService.updateRule(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Rule updated successfully",
            data: rule
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const deleteRule = async (req, res) => {
    try {
        await ruleService.deleteRule(req.params.id);

        res.status(200).json({
            success: true,
            message: "Rule deleted successfully"
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createRule,
    getAllRules,
    getRuleById,
    updateRule,
    deleteRule
};