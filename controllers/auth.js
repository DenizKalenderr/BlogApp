const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.get_register = async function(req, res) {
    try {
        return res.render("auth/register", {
            title: "register"
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_register = async function(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            
        });

        return res.redirect("login");
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_login = async function(req, res) {
    try {
        return res.render("auth/login", {
            title: "login"
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_logout = async function(req, res) {
    try {
        res.clearCookie("isAuth");
        return res.render("auth/login", {
            title: "login"
        });
    }
    catch(err) {
        console.log(err);
    }
}
exports.post_login = async function(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        //email ile eşleşen kayıt yoksa
        if(!user) {
            return res.render("auth/login", {
                title: "login",
                message: "email hatalı"
            });
        }

        const match = await bcrypt.compare(password, user.password);

        //login oldu
        if(match) {
            //session
            req.session.isAuth =1;

            
            //req-res
            //cookie

            return res.redirect("/");
        } 
        return res.render("auth/login", {
            title: "login",
            message: "parola hatalı"
        });
      
    }
    catch(err) {
        console.log(err);
    }
}