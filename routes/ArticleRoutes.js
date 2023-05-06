const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/articles/');
    },
    filename: (req, file, cb) => {
        cb(null, "article" + Date.now() + file.originalname);
    }
})

const uploads = multer({storage: storage});

const ArticleController = require("../controllers/ArticleController");

router.get("/test-route", ArticleController.test)
router.get("/course", ArticleController.course)

router.post("/save", ArticleController.save);
router.get("/articles/:last?", ArticleController.getArticles);
router.get("/article/:id", ArticleController.getArticle);
router.delete("/article/:id", ArticleController.deleteArticle);
router.put("/article/:id", ArticleController.editArticle);
router.put("/uploadImage/:id", [uploads.single("file0")], ArticleController.upload);
router.get("/image/:image", ArticleController.getImage);
router.get("/search/:search", ArticleController.search);

module.exports = router;