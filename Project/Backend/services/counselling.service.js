const Counselling = require("../models/Counselling");

const createCounselling = async (data) => {
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

module.exports = {
    createCounselling,
    getCounsellingByBeneficiary,
    getCounsellingById,
    updateCounselling
};