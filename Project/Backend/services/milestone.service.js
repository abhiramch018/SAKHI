const Milestone = require("../models/Milestone");
const Counselling = require("../models/Counselling");

const createMilestone = async (data) => {
    return await Milestone.create(data);
};

const getAllMilestones = async () => {
    return await Milestone.find().sort({ minCounselling: 1 });
};

const getAWWMilestone = async (awwId) => {
    const counsellingCount = await Counselling.countDocuments({
        aww: awwId,
        attendance: true,
        status: "COMPLETED"
    });

    const milestone = await Milestone.findOne({
        minCounselling: { $lte: counsellingCount },
        maxCounselling: { $gte: counsellingCount }
    });

    return {
        counsellingCount,
        milestone
    };
};

module.exports = {
    createMilestone,
    getAllMilestones,
    getAWWMilestone
};