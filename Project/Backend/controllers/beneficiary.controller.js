const beneficiaryService = require("../services/beneficiary.service");

const createBeneficiary = async (req, res) => {
    try {
        const beneficiary =
            await beneficiaryService.createBeneficiary(req.body);

        res.status(201).json({
            success: true,
            message: "Beneficiary created successfully",
            data: beneficiary
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllBeneficiaries = async (req, res) => {
    try {
        const beneficiaries =
            await beneficiaryService.getAllBeneficiaries();

        res.status(200).json({
            success: true,
            data: beneficiaries
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getBeneficiaryById = async (req, res) => {
    try {
        const beneficiary =
            await beneficiaryService.getBeneficiaryById(req.params.id);

        res.status(200).json({
            success: true,
            data: beneficiary
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const updateBeneficiary = async (req, res) => {
    try {
        const beneficiary =
            await beneficiaryService.updateBeneficiary(
                req.params.id,
                req.body
            );

        res.status(200).json({
            success: true,
            message: "Beneficiary updated successfully",
            data: beneficiary
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createBeneficiary,
    getAllBeneficiaries,
    getBeneficiaryById,
    updateBeneficiary
};