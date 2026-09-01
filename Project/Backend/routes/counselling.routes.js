const express = require("express");

const {
    createCounselling,
    getCounsellingEligibility,
    getCounsellingByBeneficiary,
    getCounsellingById,
    updateCounselling,
    markAttendance
} = require("../controllers/counselling.controller");

const router = express.Router();

router.post("/", createCounselling);

router.get(
    "/beneficiary/:beneficiaryId/eligibility",
    getCounsellingEligibility
);

router.get(
    "/beneficiary/:beneficiaryId",
    getCounsellingByBeneficiary
);

router.get("/:id", getCounsellingById);

router.put("/:id", updateCounselling);

router.patch("/:id/attendance", markAttendance);


module.exports = router;