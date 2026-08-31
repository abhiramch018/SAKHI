const User = require("../models/User");

const createAWW = async (data) => {
    const existingUser = await User.findOne({
        email: data.email
    });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const aww = await User.create({
        ...data,
        role: "AWW"
    });

    return aww;
};

const getAllAWWs = async () => {
    return await User.find({ role: "AWW" }).select("-password");
};

const getAWWById = async (id) => {
    const aww = await User.findOne({
        _id: id,
        role: "AWW"
    }).select("-password");

    if (!aww) {
        throw new Error("AWW not found");
    }

    return aww;
};

module.exports = {
    createAWW,
    getAllAWWs,
    getAWWById
};