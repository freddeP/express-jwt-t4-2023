const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');

module.exports = {log, auth};

/* Custom middleware */

function log(req, res, next){

    console.log("URL = "+req.url);

    if(req.url == "/")
    return res.send("My index route is not yet ready");

    next();


}


async function auth(req, res, next){

    let token = req.cookies['auth-token'];

    try {
        
        token = jwt.verify(token, process.env.SECRET2);
        let user = {email: token.email, role: token.role}
        req.user = user;
        next();


    } catch (error) {
        res.redirect("/?errorAuthMW");
    }


}