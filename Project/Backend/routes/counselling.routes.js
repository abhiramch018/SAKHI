const express = require("express");

const {
    createCounselling,
    getCounsellingByBeneficiary,
    getCounsellingById,
    updateCounselling
} = require("../controllers/counselling.controller");

const router = express.Router();

router.post("/", createCounselling);

router.get(
    "/beneficiary/:beneficiaryId",
    getCounsellingByBeneficiary
);

router.get("/:id", getCounsellingById);

router.put("/:id", updateCounselling);

module.exports = router;