const express = require("express");
const router = express.Router();


const db = require("../data/db");
const { route } = require("./admin");
const imageUpload = require("../helpers/image-upload");

const { title } = require("process");

const adminController = require("../controllers/admin");


router.get("/blog/delete/:blogid", adminController.get_blog_delete);

router.post("/blog/delete/:blogid", adminController.post_blog_delete);

//categories delete
router.get("/category/delete/:categoryid", adminController.get_category_delete);

router.post("/category/delete/:categoryid", adminController.post_category_delete);

router.get("/blog/create", adminController.get_blog_create);

router.post("/categories/remove", adminController.get_category_remove);

router.post("/blog/create", imageUpload.upload.single("image"), adminController.post_blog_create);

router.get("/category/create", adminController.get_category_create);

router.post("/category/create", adminController.post_category_create);

router.get("/blogs/:blogid", adminController.get_blog_edit);

router.post("/blogs/:blogid", imageUpload.upload.single("image"), adminController.post_blog_edit);


// categories edit
router.get("/categories/:categoryid", adminController.get_category_edit);

router.post("/categories/:categoryid", adminController.post_category_edit);

router.get("/blogs", adminController.get_blogs);

router.get("/categories", adminController.get_categories);

module.exports = router;