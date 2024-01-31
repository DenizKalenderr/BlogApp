const express = require("express");
const router = express.Router();

const db = require("../data/db");


const data = {
    title: "Popüler Kurslar",
    categories: ["Web Geliştirme", "Programlama", "Mobil Uygulamalar", "Veri Analizi", "Ofis Uygulamaları"],
    blogs: [
        {
            blogid: 1,
            title: "Komple Uygulamalı Web Geliştirme",
            desc: "Sıfırdan ileri seviye web geliştirme",
            image: "web.jpg",
            homepage: true,
            confirmation: true
        },
        {
            blogid: 2,
            title: "Python İle Sıfırdan İleriye Programlama",
            desc: "Sıfırdan ileri seviye python programlama",
            image: "python.jpg",
            homepage: true,
            confirmation: true
        },
        {
            blogid: 3,
            title: "Node.js İle Sıfırdan İleriye Programlama",
            desc: "Sıfırdan ileri seviye Node.js",
            image: "images.jpg",
            homepage: false,
            confirmation: true
        },
        {
            blogid: 4,
            title: "Ofis Uygulamaları",
            desc: "Ofis Uygulamaları Geliştirme",
            image: "web.jpg",
            homepage: true,
            confirmation: true
        },
    ]
}

router.use("/blogs/:blogid", function (req, res) {

    res.render("users/blog-details")
});

router.use("/blogs", function (req, res) {
    db.query()
    res.render("users/blogs", data)
});

router.use("/", function async(req, res) {
    db.query("select*from blog")
        .then(result => {
            
            console.log(result[0]);
            res.render("users/index", data);

        })
        .catch(err => console.log(err));

});

module.exports = router;