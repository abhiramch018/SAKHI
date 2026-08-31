const express = require("express");

const {
    createBeneficiary,
    getAllBeneficiaries,
    getBeneficiaryById,
    updateBeneficiary
} = require("../controllers/beneficiary.controller");

const router = express.Router();

router.post("/", createBeneficiary);

router.get("/", getAllBeneficiaries);

router.get("/:id", getBeneficiaryById);

router.put("/:id", updateBeneficiary);

module.exports = router;