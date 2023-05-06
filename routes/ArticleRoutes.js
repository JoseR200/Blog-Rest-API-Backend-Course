const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/ArticleController");

router.get("/test-route", ArticleController.test)
router.get("/course", ArticleController.course)

router.post("/save", ArticleController.save);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.put("/article/:id", ArticleController.editArticle);

module.exports = router;