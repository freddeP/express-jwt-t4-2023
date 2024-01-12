require('dotenv').config()
const express = require("express");
const {log, auth} = require("./mw");
const cookieParser = require('cookie-parser');
require("pug");
const send = require("./email");


console.log("secret",process.env.NODE_SECRET);

const {guitars} = require("./controllers");

const app = express();

app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("lyssnar på 3456");   
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));

app.set("view engine", "pug");

let user = "user";

let cars = ["saab", "tesla", "lada"];

app.get("/test",(req, res)=>{
    res.render("test",{title:"cars", cars});
});



const {getAllData} = require("./db");
app.get("/",async (req, res)=>{
    let guitars = await getAllData();
    res.render("guitars",{title:"My Guitars", guitars});
});




app.get("/guitars",guitars.index);
app.post("/guitars", guitars.create);
app.get("/guitars/:id", guitars.show);
app.delete("/guitars/:id", guitars.destroy);
app.put("/guitars/:id", guitars.update);



// Auth routes
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");

app.post("/login", login);
app.post("/verify",cookieParser(), verify);

async function verify(req, res){

    let {code} = req.body;
    let {token} = req.cookies;

    // Verifiera token
    try {
        let checkedToken = await jwt.verify(token,process.env.SECRET1);
        console.log("checkedToken", checkedToken);

        let hash = checkedToken.hash;

        let checkPassword = await bcrypt.compare(code, hash);
        console.log("checkPassword", checkPassword);
        if(checkPassword){

            let payload = {
                email:checkedToken.email,
                role:"pwl-user"
            }
            // Byt secret efter jul OBS bör inte vara samma som vid tillfällig token
            let authToken = await jwt.sign(payload, process.env.SECRET2,{
                expiresIn:"3h"
            });
            res.cookie("auth-token",authToken,{
              httpOnly:true  
            })
            return res.json(authToken);
        }
        return res.json({error:"Wrong Code"});

    } catch (error) {
        //console.log("error",error);
        return res.json(error);
    }



    // om det gick bra ska vi kolla lösenordet 

    // om ALLT gick bra skapar vi en ny token som varar längre och 
    // som skall fungera som auth-token för andra requests



/*     res.json({code, token}); */

}




async function login(req, res){

    let email = req.body.email;
    // Skapa engångslösenord
    let code = uniqid();

    // Simulera att kod skickas via mail ( vi använder console.log)
    console.log(code);


    let hash = await bcrypt.hash(code, 12);
    // Använder miljövariabel skapad i windows
    let token = await jwt.sign({email, hash},process.env.SECRET1, {expiresIn:120});

    // skicka kod till användare via mail
    send(email, code);

    res.cookie("token",token,{
        maxAge:60000
    });

    return res.redirect("/verify.html");
    res.json(token);  // för postman..

}






