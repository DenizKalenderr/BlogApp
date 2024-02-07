const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize");

exports.blogs_by_category = async function (req, res) {
    
    const id = parseInt(req.params.categoryid);
    try {
        const blogs = await Blog.findAll({
            where: {
                confirmation: true
            },
            include: {
                model: Category,
                where: { id: id}
            },
            raw: true
        });

        const categories = await Category.findAll({ raw: true });

        res.render("users/blogs" , {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: id,
            
        })
    }
    catch (err) {

        console.log(err);
    }
}

exports.blogs_details = async function (req, res) {
    const id = parseInt(req.params.blogid);

    try {
        const result = await Blog.findOne({
            where: {
                id: id
            },
            raw:true
        });

        if(result){
            return res.render("users/blog-details", {
                title: result.title,
                result: result
            });
        }
        res.redirect("/");
           
    } catch (err) {

        console.log(err);
    }
}

exports.blog_list = async function (req, res) {
    try {
        const result = await Blog.findAll({
            where: {
                //onaylılar gelecek.
                confirmation: {
                    [Op.eq]: true
                }
            },
            raw:true
            
        });
        const sonuc = await Category.findAll({ raw: true });

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
}

exports.index = async function (req, res) {
    console.log(req.cookies);
    try {
        const result = await Blog.findAll({
            where: {
                //sequelize in operatörünü kullandık-Op
                [Op.and]: [
                    { homepage: true},
                    { confirmation: true}
                ]
            },
            raw:true // ekstra parametre gelmez.
        });
        const sonuc = await Category.findAll({ raw: true });

        res.render("users/index", {
            title: "Popüler Kurslar",
            blogs: result,
            categories: sonuc,
            selectedCategory: null,
            isAuth: req.session.isAuth
        });
    } catch (err) {
        console.log(err);
    }
}
