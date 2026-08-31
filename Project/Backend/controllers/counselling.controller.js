const counsellingService = require("../services/counselling.service");

const createCounselling = async (req, res) => {
    try {
        const counselling =
            await counsellingService.createCounselling(req.body);

        res.status(201).json({
            success: true,
            message: "Counselling session created",
            data: counselling
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getCounsellingByBeneficiary = async (req, res) => {
    try {
        const counselling =
            await counsellingService.getCounsellingByBeneficiary(
                req.params.beneficiaryId
            );

        res.status(200).json({
            success: true,
            data: counselling
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCounsellingById = async (req, res) => {
    try {
        const counselling =
            await counsellingService.getCounsellingById(req.params.id);

        res.status(200).json({
            success: true,
            data: counselling
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const updateCounselling = async (req, res) => {
    try {
        const counselling =
            await counsellingService.updateCounselling(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Counselling updated successfully",
            data: counselling
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};
const markAttendance = async (req, res) => {
    try {
        const counselling =
            await counsellingService.markAttendance(req.params.id);

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully",
            data: counselling
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCounselling,
    getCounsellingByBeneficiary,
    getCounsellingById,
    updateCounselling,
    markAttendance
};