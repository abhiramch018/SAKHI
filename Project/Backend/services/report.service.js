const Report = require("../models/Report");

const createReport = async (data) => {
    return await Report.create(data);
};

const getReportById = async (id) => {
    const report = await Report.findById(id)
        .populate("beneficiary")
        .populate("aww", "-password")
        .populate("counselling");

    if (!report) {
        throw new Error("Report not found");
    }

    return report;
};

const getReportsByBeneficiary = async (beneficiaryId) => {
    return await Report.find({
        beneficiary: beneficiaryId
    })
        .populate("counselling")
        .populate("aww", "-password")
        .sort({ reportDate: -1 });
};

const getAllReports = async () => {
    return await Report.find()
        .populate("beneficiary")
        .populate("aww", "-password")
        .populate("counselling")
        .sort({ reportDate: -1 });
};

module.exports = {
    createReport,
    getReportById,
    getReportsByBeneficiary,
    getAllReports
};