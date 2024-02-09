const express = require("express");
const router = express.Router();


const db = require("../data/db");
const { route } = require("./admin");
const imageUpload = require("../helpers/image-upload");
const isAuth = require("../middlewares/auth")

const { title } = require("process");

const adminController = require("../controllers/admin");


router.get("/blog/delete/:blogid",isAuth ,adminController.get_blog_delete);

router.post("/blog/delete/:blogid",isAuth ,adminController.post_blog_delete);

//categories delete
router.get("/category/delete/:categoryid",isAuth ,adminController.get_category_delete);

router.post("/category/delete/:categoryid",isAuth ,adminController.post_category_delete);

router.get("/blog/create",isAuth ,adminController.get_blog_create);

router.post("/categories/remove",isAuth ,adminController.get_category_remove);

router.post("/blog/create",isAuth ,imageUpload.upload.single("image"), adminController.post_blog_create);

router.get("/category/create",isAuth ,adminController.get_category_create);

router.post("/category/create",isAuth ,adminController.post_category_create);

router.get("/blogs/:blogid",isAuth ,adminController.get_blog_edit);

router.post("/blogs/:blogid",isAuth ,imageUpload.upload.single("image"), adminController.post_blog_edit);


// categories edit
router.get("/categories/:categoryid",isAuth ,adminController.get_category_edit);

router.post("/categories/:categoryid",isAuth ,adminController.post_category_edit);

router.get("/blogs",isAuth ,adminController.get_blogs);

router.get("/categories",isAuth ,adminController.get_categories);

router.get("/roles",isAuth, adminController.get_roles);
router.get("/roles/:roleid",isAuth, adminController.get_role_edit);
router.post("/roles/remove",isAuth, adminController.roles_remove);
router.post("/roles/:roleid",isAuth, adminController.post_role_edit);

router.get("/users", isAuth, adminController.get_user);
router.get("/users/:userid", isAuth, adminController.get_user_edit);
router.post("/users/:userid", isAuth, adminController.post_user_edit);

module.exports = router;