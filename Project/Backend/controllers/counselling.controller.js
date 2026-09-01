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
        const status = error.code === "COOLDOWN" || error.code === "IN_PROGRESS" ? 403 : 400;
        res.status(status).json({
            success: false,
            message: error.message,
            code: error.code,
            details: error.details
        });
    }
};

const getCounsellingEligibility = async (req, res) => {
    try {
        const eligibility =
            await counsellingService.checkCounsellingEligibility(
                req.params.beneficiaryId
            );

        res.status(200).json({
            success: true,
            data: eligibility
        });
    } catch (error) {
        res.status(500).json({
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
    getCounsellingEligibility,
    getCounsellingByBeneficiary,
    getCounsellingById,
    updateCounselling,
    markAttendance
};