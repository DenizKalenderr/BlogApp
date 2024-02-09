// express modülleri
const express = require("express");
const app = express();


const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// node modules
const path = require("path");

// custom modules
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middlewares/locals");

// template engine
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: false})); // formdan gelen verinin hangi formda geleceğini belirliyoruz.
app.use(cookieParser());
app.use(session({
    secret: "hello",
    resave: false, // bir değişiklik yaptığımızda güncelleme olur
    saveUninitialized: false, //siteyi ziyaret eden her kullanıcı için session oluşturulacağı garantisi
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
    store: new SequelizeStore({
        db: sequelize
    })

}));

app.use(locals);


// models
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");
const Role = require("./models/role");



// routes
const userRoute = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");



app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));


app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoute);

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

Role.belongsToMany(User, { through: "userRoles"});
User.belongsToMany(Role, { through: "userRoles"});

(async () => {
    //  await sequelize.sync({ force: true });
    //  await dummyData();
})();


app.listen(3000, function () {
    console.log("listening on port 3000");
});