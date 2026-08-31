const express = require("express");

const {
    createReport,
    getReportById,
    getReportsByBeneficiary,
    getAllReports
} = require("../controllers/report.controller");

const router = express.Router();

router.post("/", createReport);

router.get("/", getAllReports);

router.get("/beneficiary/:beneficiaryId", getReportsByBeneficiary);

router.get("/:id", getReportById);

module.exports = router;