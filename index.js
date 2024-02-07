const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: false})); // formdan gelen verinin hangi formda geleceğini belirliyoruz.

app.set("view engine", "ejs");

const path = require("path");
const userRoute = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));


app.use("/admin", adminRoutes);
app.use(userRoute);

const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const Category = require("./models/category");
const Blog = require("./models/blog");

Blog.belongsToMany(Category, { through: "blogCategories"});
Category.belongsToMany(Blog, { through: "blogCategories"});

(async () => {
    await sequelize.sync({ force: true });
    await dummyData();
})();


app.listen(3000, function () {
    console.log("listening on port 3000");
});