const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const config = require("../config");
const crypto = require("crypto");
const { Op } = require("sequelize");

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
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword, });

        emailService.sendMail({
            from: config.email.from,
            to: newUser.email,
            subject: "Hesabınız oluşturuldu",
            text: "Hesabınız başarıyla oluşturuldu",

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

exports.get_reset = async function(req, res) {
    const message = req.session.message; 
    delete req.session.message;
    try {
        return res.render("auth/reset-password", {
            title: "reset password",
            message: message
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_reset = async function(req, res) {
    const email = req.body.email;

    try {
        var token = crypto.randomBytes(32).toString("hex");
        const user = await User.findOne({ where: { email: email }});
        if(!user) {
            req.session.message = {text: "Email bulunamadı.", class: "danger"};
            return res.redirect("reset-password");
        }

        //gelen mailin doğrulama süresini belirledik.
        // vt na kaydolacak. 
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + (1000 * 60 * 60);
        await user.save();

        emailService.sendMail({
            from: config.email.from,
            to: email,
            subject: "Reset Password",
            html: '<p><a href="http://127.0.0.1:3000/account/new-password/' + token + '">Reset Password Link</a></p>'
        });

        req.session.message = { text: "email adresinizi kontrol ediniz.", class: "success"};
        res.redirect("login");

    }
    catch(err) {
        console.log(err);
    }
}

exports.get_newpassword = async function(req, res) {
    const token = req.params.token; 
    delete req.session.message;
    try {
        const user = await User.findOne({
           where: {
            resetToken: token,
            resetTokenExpiration: {
                [Op.gt] : Date.now()
            }
           } 
        })
        return res.render("auth/new-password", {
            title: "new password",
            token: token,
            userId: user.id
        });
    }
    catch(err) {
        console.log(err);
    }
}

exports.post_newpassword = async function(req, res) {
        const token = req.body.token;
        const userId = req.body.userId;
        const newPassword = req.body.password;
    try {
        const user = await User.findOne({
            where: {
             resetToken: token,
             resetTokenExpiration: {
                 [Op.gt] : Date.now()
             },
             id: userId
            } 
         });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpiration = null;
        await user.save();

        req.session.message = {text: "parola güncellendi", class:"success"};
        return res.redirect("login");

    }
    catch(err) {
        console.log(err);
    }
}