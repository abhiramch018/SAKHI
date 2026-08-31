const User = require("../models/User");
const Counselling = require("../models/Counselling");
const Report = require("../models/Report");
const Performance = require("../models/Performance");

const getDashboardData = async () => {
    const totalAWWs = await User.countDocuments({
        role: "AWW"
    });

    const totalCounselling = await Counselling.countDocuments({
        attendance: true,
        status: "COMPLETED"
    });

    const totalReports = await Report.countDocuments();

    const performances = await Performance.find()
        .populate("aww", "-password")
        .sort({ overallScore: -1 });

    return {
        totalAWWs,
        totalCounselling,
        totalReports,
        performances
    };
};

const getAWWDetails = async (awwId) => {
    const aww = await User.findById(awwId).select("-password");

    if (!aww) {
        throw new Error("AWW not found");
    }

    const counsellingCount = await Counselling.countDocuments({
        aww: awwId,
        attendance: true,
        status: "COMPLETED"
    });

    const reports = await Report.find({
        aww: awwId
    })
        .populate("beneficiary")
        .sort({ reportDate: -1 });

    const performance = await Performance.find({
        aww: awwId
    }).sort({ periodStart: -1 });

    return {
        aww,
        counsellingCount,
        reports,
        performance
    };
};

module.exports = {
    getDashboardData,
    getAWWDetails
};