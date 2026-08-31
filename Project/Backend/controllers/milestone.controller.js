const milestoneService = require("../services/milestone.service");

const createMilestone = async (req, res) => {
    try {
        const milestone = await milestoneService.createMilestone(
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Milestone created successfully",
            data: milestone
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllMilestones = async (req, res) => {
    try {
        const milestones =
            await milestoneService.getAllMilestones();

        res.status(200).json({
            success: true,
            data: milestones
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAWWMilestone = async (req, res) => {
    try {
        const result =
            await milestoneService.getAWWMilestone(
                req.params.awwId
            );

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createMilestone,
    getAllMilestones,
    getAWWMilestone
};