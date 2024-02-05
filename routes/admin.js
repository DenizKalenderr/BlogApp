const express = require("express");
const router = express.Router();
const fs = require("fs");

const db = require("../data/db");
const { route } = require("./admin");

const imageUpload = require("../helpers/image-upload");

router.get("/blog/delete/:blogid", async function(req, res) {
    const blogid = req.params.blogid;

    try {
        const blogs = await db.query("select * from blog where blogid=" +blogid);
        const blog = blogs[0];

        res.render("admin/blog-delete", {
            title: "delete blog",
            blog: blog,
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/blog/delete/:blogid", async function(req, res) {
    const blogid = req.body.blogid;
    try{
        await db.query("delete from blog where blogid=$1", [blogid]);
        res.redirect("/admin/blogs?action=delete");
    }
    catch(err){
        console.log(err);
    }
});

//categories delete

router.get("/category/delete/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid;

    try {
        const categories = await db.query("select * from category where categoryid=" +categoryid);
        const category = categories[0];

        res.render("admin/category-delete", {
            title: "delete category",
            category: category,
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/category/delete/:categoryid", async function(req, res) {
    const categoryid = req.body.categoryid;
    try{
        await db.query("delete from category where categoryid=$1", [categoryid]);
        res.redirect("/admin/categories?action=delete");
    }
    catch(err){
        console.log(err);
    }
});

router.get("/blog/create", async function(req, res) {
    try{
        const categories = await db.query("select * from category");

        res.render("admin/blog-create", {
            title: "add blog",
            categories: categories
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/blog/create", imageUpload.upload.single("image"), async function(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const image = req.file.filename;
    const homepage = req.body.homepage == "on" ? true:false;
    const confirmation = req.body.confirmation == "on" ? true:false;
    const category = req.body.category;
    
    try{
        await db.query("INSERT INTO blog(title, description, image, homepage, confirmation, categoryid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING blogid",
        [title, description, image, homepage, confirmation, category]);
        res.redirect("/admin/blogs?action=create");
    }
    catch(err){
        console.log(err);
    }
});
router.get("/category/create", async function(req, res) {
    try{
        const categories = await db.query("select * from category");
        res.render("admin/category-create", {
            title: "add category",
        });
    }
    catch(err){
        console.log(err);
    }
});

router.post("/category/create", async function(req, res) {
    const name = req.body.name;
    try{
        await db.query("INSERT INTO category(name) VALUES ($1)",
        [name]);
        res.redirect("/admin/categories?action=create");
    }
    catch(err){
        console.log(err);
    }
});


router.get("/blogs/:blogid", async function(req, res) {
    const blogid = req.params.blogid;

    try{
        const blogs = await db.query("select * from blog where blogid=" +blogid);
        const categories = await db.query("select * from category");
        const blog = blogs[0];

        if(blog) {
            return res.render("admin/blog-edit", {
                title: blog.title,
                blog: blog,
                categories: categories
            });
        }
        res.render("admin/blogs");
        

    }catch(err){
        console.log(err);
    }
    
});

router.post("/blogs/:blogid", imageUpload.upload.single("image"), async function(req, res) {
    const blogid = req.body.blogid;
    const title = req.body.title;
    const description = req.body.description;
    let image = req.body.image;

    if(req.file) {
        image = req.file.filename;      
        fs.unlink("./public/images/" + req.body.image, err => {
            console.log(err);
        });
    }
    const homepage = req.body.homepage == "on" ? true : false;
    const confirmation = req.body.confirmation == "on" ? true : false;
    const category = req.body.category;

    try{
        await db.query("UPDATE blog SET title = $1, description = $2, image = $3, homepage = $4, confirmation = $5, categoryid = $6 WHERE blogid = $7",
        [title, description, image, homepage, confirmation, category, blogid]);
        res.redirect("/admin/blogs?action=edit&blogid=" +blogid); //query string 
    }
    catch(err){
        console.log(err);
    }
    
});

// categories edit
router.get("/categories/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid;

    try{
        const categories = await db.query("select * from category where categoryid=" +categoryid);
        const category = categories[0];

        if(category) {
            return res.render("admin/category-edit", {
                title: category.name,
                category: category
            });
        }
        res.render("admin/categories");
        

    }catch(err){
        console.log(err);
    }
    
});

router.post("/categories/:categoryid", async function(req, res) {
    const categoryid = req.body.categoryid;
    const name = req.body.name;

    try{
        await db.query("UPDATE category SET name = $1  WHERE categoryid = $2",
        [name, categoryid]);
        res.redirect("/admin/categories?action=edit&categoryid=" +categoryid); //query string 
    }
    catch(err){
        console.log(err);
    }
    
});

router.get("/blogs", async function (req, res) {
    try{
        const blogs = await db.query("select blogid, title, image from blog");
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        });
    } catch(err){
        console.log(err);
    }
    });

router.get("/categories", async function (req, res) {
    try{
        const categories = await db.query("select * from category");
        res.render("admin/category-list", {
            title: "blog list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    } catch(err){
        console.log(err);
    }
    });

module.exports = router;