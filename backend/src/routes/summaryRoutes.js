const express = require("express");
const router = express.Router();
const { summarize } = require("../controllers/summaryController");

router.post("/", summarize);

module.exports = router;
