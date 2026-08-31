const reportService = require("../services/report.service");

const createReport = async (req, res) => {
    try {
        const report = await reportService.createReport(req.body);

        res.status(201).json({
            success: true,
            message: "Report created successfully",
            data: report
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getReportById = async (req, res) => {
    try {
        const report = await reportService.getReportById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const getReportsByBeneficiary = async (req, res) => {
    try {
        const reports =
            await reportService.getReportsByBeneficiary(
                req.params.beneficiaryId
            );

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAllReports = async (req, res) => {
    try {
        const reports = await reportService.getAllReports();

        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createReport,
    getReportById,
    getReportsByBeneficiary,
    getAllReports
};