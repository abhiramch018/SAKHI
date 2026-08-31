const performanceService = require("../services/performance.service");

const createPerformance = async (req, res) => {
    try {
        const performance =
            await performanceService.createPerformance(req.body);

        res.status(201).json({
            success: true,
            message: "Performance created successfully",
            data: performance
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAWWPerformance = async (req, res) => {
    try {
        const performance =
            await performanceService.getAWWPerformance(
                req.params.awwId
            );

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getPerformanceById = async (req, res) => {
    try {
        const performance =
            await performanceService.getPerformanceById(
                req.params.id
            );

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createPerformance,
    getAWWPerformance,
    getPerformanceById
};