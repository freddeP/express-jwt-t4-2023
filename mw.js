const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const {getAllData} = require("./db");

module.exports = {log, auth, isMine, isUser};

/* Custom middleware */

function log(req, res, next){

    console.log("URL = "+req.url);

    if(req.url == "/")
    return res.send("My index route is not yet ready");

    next();


}

async function isUser(req, res, next){

    let token = req.cookies['auth-token'];

    try {
        
        token = jwt.verify(token, process.env.SECRET2);
        let user = {email: token.email, role: token.role}
        req.user = user;
        next();


    } catch (error) {
        req.user = null;
        next();
    }


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


async function isMine(req, res, next){
    try {
        let id = req.params.id;
        let guitars = await getAllData();

        let guitar = guitars.find(g=>{
            return g.id == id && g.user.email == req.user.email;
        });

        console.log("delete guitar");
        console.log(guitar, Boolean(guitar));
        if(guitar) return next();

        res.send({error:"NOT YOUR GUITAR"});



    } catch (error) {
        res.status(500).send(error);
    }
    




}