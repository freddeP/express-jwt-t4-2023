const express = require("express");
const {log, auth} = require("./mw");

const {guitars} = require("./controllers");

const app = express();

app.listen(3456, err=> {
    if(err) return console.log(err);
    console.log("lyssnar på 3456");   
});

app.use(express.urlencoded({extended:true}));
app.use(express.json());

let user = "user";


app.get("/guitars",log, guitars.index);
app.post("/guitars", guitars.create);
app.get("/guitars/:id",log, auth(user), guitars.show);
app.delete("/guitars/:id", guitars.destroy);
app.put("/guitars/:id", guitars.update);



// Auth routes
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uniqid = require("uniqid");

app.post("/login", login);

async function login(req, res){

    let email = req.body.email;
    // Skapa engångslösenord
    let code = uniqid();
    console.log(code);
    let hash = await bcrypt.hash(code, 12);

    let token = await jwt.sign({email, hash},process.env.secret, {expiresIn:60});

    res.json(token);

}

//app.post("/verify", verify);




