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
        const user = await User.findOne({ where: { email: email }});
        if(user) {
            console.log(req.session);
            req.session.message = {text: "Girdiğiniz email zaten kayıtlı!", class: "warning"};
            return res.redirect("login");
        }
        await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            
        });

        req.session.message = {text: "Hesabınıza giriş yapabilirsiniz.", class: "success"};

        return res.redirect("login");
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_login = async function(req, res) {
    const message = req.session.message; 
    delete req.session.message;
    try {
        return res.render("auth/login", {
            title: "login",
            message: message
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.get_logout = async function(req, res) {
    try {
        await req.session.destroy();
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
                message: {text: "Email hatalı", class: "danger"}
            });
        }

        const match = await bcrypt.compare(password, user.password);

        //login oldu
        if(match) {
            //session
            req.session.isAuth = true;
            req.session.name = user.name;
            //req-res
            //cookie
            const url = req.query.returnUrl || "/";
            return res.redirect(url);
        } 
        return res.render("auth/login", {
            title: "login",
            message: {text: "Parola hatalı", class: "danger"}
        });
      
    }
    catch(err) {
        console.log(err);
    }
}