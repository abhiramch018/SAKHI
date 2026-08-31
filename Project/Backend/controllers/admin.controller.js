const adminService = require("../services/admin.service");

const getDashboardData = async (req, res) => {
    try {
        const dashboard =
            await adminService.getDashboardData();

        res.status(200).json({
            success: true,
            data: dashboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAWWDetails = async (req, res) => {
    try {
        const details =
            await adminService.getAWWDetails(req.params.awwId);

        res.status(200).json({
            success: true,
            data: details
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardData,
    getAWWDetails
};