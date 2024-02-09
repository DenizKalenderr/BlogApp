const Blog = require("../models/blog");
const Category = require("../models/category");
const Role = require("../models/role");
const User = require("../models/user");

const { Op } = require("sequelize");
const sequelize = require("../data/db");

const fs = require("fs");

exports.get_blog_delete = async function(req, res) {
    const blogid = req.params.blogid;

    try {
        const blog = await Blog.findByPk(blogid);

        if(blog) {
            return res.render("admin/blog-delete", {
                title: "delete blog",
                blog: blog,
            });
        }
        res.redirect("/admin/blogs");
      
    }
    catch(err){
        console.log(err);
    }
}

exports.post_blog_delete = async function(req, res) {
    const blogid = req.body.blogid;
    try{
        const blog = await Blog.findByPk(blogid);
        if(blog) {
            await blog.destroy();
            return res.redirect("/admin/blogs?action=delete");
        }
        res.redirect("/admin/blogs");
        
    }
    catch(err){
        console.log(err);
    }
}

exports.get_category_delete = async function(req, res) {
    
    const categoryid = req.params.categoryid;

    try {
        const category = await Category.findByPk(categoryid);

        if(category){
            res.render("admin/category-delete", {
                title: "delete category",
                category: category,
            });
        }
        res.redirect("/admin/category-list");
        
    }
    catch(err){
        console.log(err);
    }
}

exports.post_category_delete = async function(req, res) {
    const categoryid = req.body.categoryid;
    try{
        await Category.destroy({
            where: {
                id: categoryid
            }
        });
        res.redirect("/admin/categories?action=delete");
    }
    catch(err){
        console.log(err);
    }
}

exports.get_blog_create = async function(req, res) {
    try{
        //const categories = await db.query("select * from category");
        const categories = await Category.findAll();

        res.render("admin/blog-create", {
            title: "add blog",
            categories: categories,
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.post_blog_create = async function(req, res) {
    const title = req.body.title;
    const description = req.body.description;
    const image = req.file.filename;
    const homepage = req.body.homepage == "on" ? true:false;
    const confirmation = req.body.confirmation == "on" ? true:false;
    const category = req.body.category;
    
    try{
        await Blog.create({
            title: title,
            description: description,
            image: image,
            homepage: homepage,
            confirmation: confirmation,
            categoryId: category
        });
        res.redirect("/admin/blogs?action=create");
    }
    catch(err){
        console.log(err);
    }
}

exports.get_category_create = async function(req, res) {
    try{
        res.render("admin/category-create", {
            title: "add category"
        });
    }
    catch(err){
        console.log(err);
    }
}

exports.post_category_create = async function(req, res) {
    const name = req.body.name;
    try{
        await Category.create({ name: name});
        res.redirect("/admin/categories?action=create");
    }
    catch(err){
        console.log(err);
    }
}

exports.get_blog_edit = async function(req, res) {
    const blogid = req.params.blogid;

    try{
        const blog = await Blog.findOne({
            where: {
                id: blogid
            },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        const categories = await Category.findAll();

        if(blog) {
            return res.render("admin/blog-edit", {
                title: blog.dataValues.title,
                blog: blog.dataValues,
                categories: categories
            });
        }
        res.render("admin/blogs");
        

    }catch(err){
        console.log(err);
    }
    
}

exports.post_blog_edit = async function(req, res) {
    const blogid = req.body.blogid;
    const title = req.body.title;
    const description = req.body.description;
    const categoryIds = req.body.categories;

    let image = req.body.image;

    if(req.file) {
        image = req.file.filename;      
        fs.unlink("./public/images/" + req.body.image, err => {
            console.log(err);
        });
    }
    const homepage = req.body.homepage == "on" ? true : false;
    const confirmation = req.body.confirmation == "on" ? true : false;

    try{
        const blogs = await Blog.findOne({
            where: {
                id: blogid
            },
            include: {
                model: Category,
                attributes: ["id"]
            }
        });
        if(blogs){
            blogs.title = title;
            blogs.description = description;
            blogs.image = image;
            blogs.homepage = true;
            blogs.confirmation = true;

            if(categoryIds == undefined) {
                await blogs.removeCategories(blogs.categories);
            } else {
                await blogs.removeCategories(blogs.categories);
                const selectedCategories = await Category.findAll({
                    where: {
                        id: {
                            [Op.in]: categoryIds
                        }
                    }
                });
                await blogs.addCategories(selectedCategories);
            }
            await blogs.save();
            return res.redirect("/admin/blogs?action=edit&blogid=" +blogid); //query string 
        }
        res.redirect("/admin/blogs");      
    }
    catch(err){
        console.log(err);
    }
}

exports.get_category_remove = async function(req, res) {
    const blogid = req.body.blogid;
    const categoryid = req.body.categoryid;

    await sequelize.query(`delete from blogCategories where blogId=${blogid} and categoryId=${categoryid}`);
    res.redirect("/admin/categories/remove" + categoryid);
}

//lazy loading uygulandı
exports.get_category_edit = async function(req, res) {
    const categoryid = req.params.categoryid;
    

    try{
        const category = await Category.findByPk(categoryid);
        const blogs = await category.getBlogs(); // Blog sayfalarını getirir. 
        const countBlog = await category.countBlogs();

        if(category) {
            return res.render("admin/category-edit", {
                title: category.dataValues.name,
                category: category.dataValues,
                blogs: blogs,
                countBlog: countBlog
            });
        }
        res.render("admin/categories");
        

    }catch(err){
        console.log(err);
    }
    
}

exports.post_category_edit = async function(req, res) {
    const categoryid = req.body.categoryid;
    const name = req.body.name;

    try{
        //categoryid si eşleşen kaydı günceller.
        await Category.update({ name: name }, {
            where:{
                id: categoryid
            }
        });
        return res.redirect("/admin/categories?action=edit&categoryid=" + categoryid);
    }

    catch(err){
        console.log(err);
    }
    
}

exports.get_blogs = async function (req, res) {
   
    try{
        // const blogs = await db.query("select blogid, title, image from blog");
        const blogs = await Blog.findAll(
            {attributes: ["id", "title", "image"],
            include: { // categoryden sadece name alanını alıp dahil ettik. JOIN işlemi.
                model: Category,
                attributes: ["name"]
            }
        });
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs,
            action: req.query.action,
            blogid: req.query.blogid
        });

        {

        }
    } catch(err){
        console.log(err);
    }
}

exports.get_categories = async function (req, res) {
    try{
        const categories = await Category.findAll();

        res.render("admin/category-list", {
            title: "blog list",
            categories: categories,
            action: req.query.action,
            categoryid: req.query.categoryid
        });
    } catch(err){
        console.log(err);
    }
}

exports.get_roles = async function (req, res) {
    try{
        const roles = await Role.findAll({
            attributes: {
                include: ['role.id', 'role.rolename',[sequelize.fn('COUNT', sequelize.col('users.id')), 'user_count']]
            },
            include: [
                { model: User, attributes:['id'] }
            ],
            group: ['role.id'],
            raw: true,
            includeIgnoreAttributes: false
        });

        res.render("admin/role-list", {
            title: "role list",
            roles: roles
        });
    } catch(err){
        console.log(err);
    }
}

exports.get_role_edit = async function (req, res) {
    const roleid = req.params.roleid;
    try{
        const role = await Role.findByPk(roleid);
        const users = await role.getUsers();
        if(role){
            return res.render("admin/role-edit", {
                title: role.rolename,
                role: role,
                users: users
            });
        }

        res.redirect("admin/roles");
        

    } catch(err){
        console.log(err);
    }
}

exports.post_role_edit = async function (req, res) {
    const roleid = req.body.roleid;
    const rolename= req.body.rolename;
    try{
        await Role.update({ rolename: rolename }, {
            where: {
                id: roleid
            }
        });
        return res.redirect("/admin/roles");
    } catch(err){
        console.log(err);
    }
}

exports.roles_remove = async function (req, res) {
    const roleid = req.body.roleid;
    const userid= req.body.userid;
    console.log(roleid, userid);
    try{
        await sequelize.query(`delete from userRoles where userId=${userid} and roleId=${roleid}`);
        return res.redirect("/admin/roles/" + roleid);
    } catch(err){
        console.log(err);
    }
}

exports.get_user = async function(req, res) {
    try{
        const users = await User.findAll({
            attributes: ["id", "name", "email"],
            include: {
                model: Role,
                attributes: ["rolename"]
            }
        });
        res.render("admin/user-list", {
            title: "user list",
            users: users
        });

    } catch(err){
        console.log(err);
    }
}

exports.get_user_edit = async function(req, res) {
    const userid = req.params.userid;
    try{
        const user = await User.findOne({
            where: {id : userid },
            include: { model: Role, attributes: ["id"] }
        });
        const roles = await Role.findAll();

        res.render("admin/user-edit", {
            title: "useredit",
            user: user,
            roles: roles
        });

    } catch(err){
        console.log(err);
    }
}

exports.post_user_edit = async function(req, res) {
    const userid = req.body.userid;
    const name = req.body.name;
    const email = req.body.email;
    const roleIds = req.body.roles;

    console.log(req.body);
    try{
        // const user = await User.findOne({
        //     where: {id : userid },
        //     include: { model: Role, attributes: ["id"] }
        // });
        // const roles = await Role.findAll();

        // res.render("admin/user-edit", {
        //     title: "useredit",
        //     user: user,
        //     roles: roles
        // });

        const user = await User.findOne({
            where: {id : userid },
            include: { model: Role, attributes: ["id"] }
        });

        if(user) {
            user.name = name;
            user.email = email;

            if(roleIds == undefined) {
                await user.removeRoles(user.roles);

            } else {
                await user.removeRoles(user.roles);
                const selectedRoles = await Role.findAll({
                    where: {
                        id: {
                            [Op.in]: roleIds //array içinde bir ögenin var olup olmadığı
                        }
                    }
                });
                await user.addRoles(selectedRoles);
            }
           
            await user.save();
            return res.redirect("/admin/users");
        }
        res.redirect("/admin/users");
        

    } catch(err){
        console.log(err);
    }
}
