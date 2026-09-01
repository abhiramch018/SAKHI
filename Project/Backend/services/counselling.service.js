const Counselling = require("../models/Counselling");

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const checkCounsellingEligibility = async (beneficiaryId) => {
    const inProgress = await Counselling.findOne({
        beneficiary: beneficiaryId,
        status: "IN_PROGRESS"
    });

    if (inProgress) {
        return {
            eligible: false,
            reason: "IN_PROGRESS",
            sessionId: inProgress._id,
            message: "A counselling session is already in progress for this beneficiary."
        };
    }

    const lastCompleted = await Counselling.findOne({
        beneficiary: beneficiaryId,
        status: "COMPLETED",
        attendance: true
    }).sort({ counsellingDate: -1 });

    if (lastCompleted) {
        const lastDate = new Date(lastCompleted.counsellingDate);
        const nextAvailableDate = new Date(lastDate.getTime() + ONE_WEEK_MS);

        if (new Date() < nextAvailableDate) {
            return {
                eligible: false,
                reason: "COOLDOWN",
                lastSessionDate: lastDate,
                nextAvailableDate,
                message: "Next counselling can only be started one week after the last completed visit."
            };
        }
    }

    return { eligible: true };
};

const createCounselling = async (data) => {
    const eligibility = await checkCounsellingEligibility(data.beneficiary);

    if (!eligibility.eligible) {
        const error = new Error(eligibility.message);
        error.code = eligibility.reason;
        error.details = eligibility;
        throw error;
    }

    return await Counselling.create(data);
};

const getCounsellingByBeneficiary = async (beneficiaryId) => {
    return await Counselling.find({
        beneficiary: beneficiaryId
    })
        .populate("beneficiary")
        .populate("aww", "-password")
        .sort({ counsellingDate: -1 });
};

const getCounsellingById = async (id) => {
    const counselling = await Counselling.findById(id)
        .populate("beneficiary")
        .populate("aww", "-password");

    if (!counselling) {
        throw new Error("Counselling session not found");
    }

    return counselling;
};

const updateCounselling = async (id, data) => {
    const counselling = await Counselling.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!counselling) {
        throw new Error("Counselling session not found");
    }

    return counselling;
};
const markAttendance = async (id) => {
    const counselling = await Counselling.findByIdAndUpdate(
        id,
        {
            attendance: true,
            status: "COMPLETED"
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!counselling) {
        throw new Error("Counselling session not found");
    }

    return counselling;
};
module.exports = {
    checkCounsellingEligibility,
    createCounselling,
    getCounsellingByBeneficiary,
    getCounsellingById,
    updateCounselling,
    markAttendance
};