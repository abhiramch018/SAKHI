const Rule = require("../models/Rule");

const createRule = async (data) => {
    return await Rule.create(data);
};

const getAllRules = async () => {
    return await Rule.find().sort({ tier: 1 });
};

const getRuleById = async (id) => {
    const rule = await Rule.findById(id);

    if (!rule) {
        throw new Error("Rule not found");
    }

    return rule;
};

const updateRule = async (id, data) => {
    const rule = await Rule.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!rule) {
        throw new Error("Rule not found");
    }

    return rule;
};

const deleteRule = async (id) => {
    const rule = await Rule.findByIdAndDelete(id);

    if (!rule) {
        throw new Error("Rule not found");
    }

    return rule;
};

module.exports = {
    createRule,
    getAllRules,
    getRuleById,
    updateRule,
    deleteRule
};