const express = require("express");
const router = express.Router();

const db = require("../data/db");

router.use("/blogs/category/:categoryid", async function (req, res) {
    const id = parseInt(req.params.categoryid);
    try {
        if (!isNaN(id)) {
            const result = await db.query("select * from blog where categoryid=" + id);
            const sonuc = await db.query("SELECT * FROM category");

            res.render("users/blogs", {
                title: "Tüm Kurslar",
                blogs: result,
                categories: sonuc,
                selectedCategory: id
            });
        }
    }
    catch (err) {

        console.log(err);
    }
});

router.use("/blogs/category/:blogid", async function (req, res) {
    const id = parseInt(req.params.blogid);

    try {
        if (!isNaN(id)) {
            const result = await db.query("select * from blog where blogid=" + id);

            result: result[0]
            res.render("users/blog-details", {
                title: result[0].title,
                
            });

            if (result) {

            } else {
                res.redirect("/");
            }
        }
    } catch (err) {

        console.log(err);
    }
});


router.use("/blogs", async function (req, res) {
    try {
        const result = await db.query("SELECT * FROM blog WHERE homepage=true");
        const sonuc = await db.query("SELECT * FROM category");

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: result,
            categories: sonuc,
            selectedCategory: null
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
});

router.use("/", async function (req, res) {

    try {
        const result = await db.query("select*from blog where homepage=true");
        const sonuc = await db.query("SELECT * FROM category");

        res.render("users/index", {
            title: "Popüler Kurslar",
            blogs: result,
            categories: sonuc,
            selectedCategory: null
        });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;