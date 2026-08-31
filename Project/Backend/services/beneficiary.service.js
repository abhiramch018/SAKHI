const Beneficiary = require("../models/Beneficiary");

const createBeneficiary = async (data) => {
    const beneficiary = await Beneficiary.create(data);

    return beneficiary;
};

const getAllBeneficiaries = async () => {
    return await Beneficiary.find();
};

const getBeneficiaryById = async (id) => {
    const beneficiary = await Beneficiary.findById(id);

    if (!beneficiary) {
        throw new Error("Beneficiary not found");
    }

    return beneficiary;
};

const updateBeneficiary = async (id, data) => {
    const beneficiary = await Beneficiary.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    if (!beneficiary) {
        throw new Error("Beneficiary not found");
    }

    return beneficiary;
};

module.exports = {
    createBeneficiary,
    getAllBeneficiaries,
    getBeneficiaryById,
    updateBeneficiary
};