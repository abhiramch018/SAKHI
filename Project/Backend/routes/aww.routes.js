const express = require("express");

const {
    createAWW,
    getAllAWWs,
    getAWWById
} = require("../controllers/aww.controller");

const router = express.Router();

router.post("/", createAWW);

router.get("/", getAllAWWs);

router.get("/:id", getAWWById);

module.exports = router;