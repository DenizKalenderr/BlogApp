const Category = require("../models/category");
const Blog = require("../models/blog");

async function populate() {
    const count = await Category.count();
    
    if(count == 0){

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