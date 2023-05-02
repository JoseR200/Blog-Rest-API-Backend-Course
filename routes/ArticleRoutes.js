const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/ArticleController");

router.get("/test-route", ArticleController.test)
router.get("/course", ArticleController.course)

router.post("/save", ArticleController.save);

module.exports = router;