const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false})); // formdan gelen verinin hangi formda geleceğini belirliyoruz.
app.use(cookieParser());
app.use(session({
    secret: "hello",
    resave: false, // bir değişiklik yaptığımızda güncelleme olur
    saveUninitialized: false //siteyi ziyaret eden her kullanıcı için session oluşturulacağı garantisi

}));



const path = require("path");
const userRoute = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));


app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoute);

const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");

// her user için bir blog, blog table da userid kolonu olacak.
//Bire çok ilişki.
// blog a eklenir.
Blog.belongsTo(User, {
    foreignKey: {
        allowNull: true
    }
});
User.hasMany(Blog); // Bir user birden fazla bloga sahip olabilir.

Blog.belongsToMany(Category, { through: "blogCategories"});
Category.belongsToMany(Blog, { through: "blogCategories"});

(async () => {
    await sequelize.sync({ force: true });
    await dummyData();
})();


app.listen(3000, function () {
    console.log("listening on port 3000");
});