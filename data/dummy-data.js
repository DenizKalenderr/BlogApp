const Category = require("../models/category");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const Role = require("../models/role");

async function populate() {
    const count = await Category.count();
    
    if(count == 0){
        
        const users = await User.bulkCreate([
            {name: "deniz kalender", email: "info@denizkalender.com" , password: await bcrypt.hash("12334", 10)},
            {name: "yeliz kalender", email: "info@yelizkalender.com" , password: await bcrypt.hash("1233456", 10)},
            {name: "emine kalender", email: "info@eminekalender.com" , password: await bcrypt.hash("1212", 10)},
            {name: "haydar kalender", email: "info@haydarkalender.com" , password: await bcrypt.hash("1111", 10)},
            {name: "meris atak", email: "info@merisatak.com" , password: await bcrypt.hash("2222", 10)},
        ]);

        const roles = await Role.bulkCreate([
            {rolename: "admin"},
            {rolename: "moderator"},
            {rolename: "guest"}
        ]);

        await users[0].addRole(roles[0]); //admin =>denizkalender
        await users[0].addRole(roles[1]);
        await users[2].addRole(roles[1]); 

        await users[3].addRole(roles[2]);
        await users[4].addRole(roles[2]);


        const categories = await Category.bulkCreate([
            { name: "Web Geliştirme"},
            { name: "Mobil Geliştirme"},
            { name: "Programlama"}
        ]);

        const blogs = await Blog.bulkCreate([
            {
                title: "Komple Uygulamalı Web Geliştirme Eğitimi",
                description: "Web geliştirme eğitimi",
                image: "web.jpg",
                homepage: true,
                confirmation: true, 
            },
            {
                title: "Sıfırdan İleriye Python Eğitimi",
                description: "Python Eğitimi",
                image: "python.jpg",
                homepage: true,
                confirmation: true,
            },
            {
                title: "dddddddd",
                description: "Python Eğitimi",
                image: "python.jpg",
                homepage: true,
                confirmation: true,
            }

        ]);


        await categories[0].addBlog(blogs[0]);
        await categories[0].addBlog(blogs[1]);

        await categories[1].addBlog(blogs[2]);
        await categories[1].addBlog(blogs[3]);

        await categories[2].addBlog(blogs[2]);
        await categories[2].addBlog(blogs[3]);

        await blogs[0].addCategory(categories[1]);

        await categories[0].createBlog({       
                title: "Yapay Zeka Eğitimi",
                description: "yapay zeka eğitimi",
                image: "web.jpg",
                homepage: true,
                confirmation: true,  
        })
    }
}

module.exports = populate;