module.exports = function(req, res, next) {
    res.locals.isAuth = req.session.isAuth; //isAuth işlemini exportslarda yapmama gerek kalmadı.
    res.locals.name = req.session.name;
    next();
}