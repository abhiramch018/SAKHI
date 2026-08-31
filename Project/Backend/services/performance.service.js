const Performance = require("../models/Performance");

const createPerformance = async (data) => {
    return await Performance.create(data);
};

const getAWWPerformance = async (awwId) => {
    return await Performance.find({
        aww: awwId
    })
        .populate("aww", "-password")
        .sort({ periodStart: -1 });
};

const getPerformanceById = async (id) => {
    const performance = await Performance.findById(id)
        .populate("aww", "-password");

    if (!performance) {
        throw new Error("Performance record not found");
    }

    return performance;
};

module.exports = {
    createPerformance,
    getAWWPerformance,
    getPerformanceById
};