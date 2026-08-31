const awwService = require("../services/aww.service");

const createAWW = async (req, res) => {
    try {
        const aww = await awwService.createAWW(req.body);

        res.status(201).json({
            success: true,
            message: "AWW created successfully",
            data: aww
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getAllAWWs = async (req, res) => {
    try {
        const awws = await awwService.getAllAWWs();

        res.status(200).json({
            success: true,
            data: awws
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAWWById = async (req, res) => {
    try {
        const aww = await awwService.getAWWById(req.params.id);

        res.status(200).json({
            success: true,
            data: aww
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createAWW,
    getAllAWWs,
    getAWWById
};