const {saveToFile, getAllData} = require("./db");
const uniqid = require("uniqid");


module.exports = {guitars:{update, index, show, destroy, create}};


async function update(req, res){

    try {
        let guitars = await getAllData();
        let guitar = guitars.find(g=>g.id == req.params.id);
    
        if(!guitar) return res.status(400).json({error: "No match"});
       
    
        let {title} = req.body;
    
        if(!title) return res.status(400).json({error: "No data"});
    
    
        guitar.title = title;
    
        saveToFile(guitars);
        res.status(200).json(guitar);
    } catch (error) {
        res.status(500).json(error);
    }


}



async function create(req, res){

    try {

        
        let files = req.files ? handleFiles(req.files.myFiles) : false

        console.log("files",req.files);

        let {title} = req.body;
        if(!title) return res.status(400).json({error:"No data"});
    
        let id = uniqid();
        
    
        let guitar = {id, title, user:req.user, files};
    
    
    
        let guitars = await getAllData();
        guitars = [guitar, ...guitars];  // lägg till först
        saveToFile(guitars);
        //res.status(201).json(guitar);
        res.redirect("/");
    } catch (error) {
        res.status(500).json(error);
    }



}



async function destroy(req, res){

try {
    let id = req.params.id;
    let guitars = await getAllData();
    let filteredGuitars = guitars.filter(g=>g.id!=id);
    if(filteredGuitars.length<guitars.length)
    {
        guitars = [...filteredGuitars];
        saveToFile(guitars);
        return res.status(200).json({message:"deleted", id});
    }
   
   
    res.status(200).json({error: "nothing deleted"});
} catch (error) {
    res.status(500).json(error);
}

}


async function show(req, res){

try {
    let id = req.params.id;
    let guitars = await getAllData();
    let guitar = guitars.find(g=>g.id==id);
    if(guitar) return res.status(200).json(guitar);

    res.status(204).end();
} catch (error) {
    res.status(500).json(error);
}


}

async function index(req, res){

    try {
        let guitars = await getAllData();
        res.json(guitars);
    } catch (error) {
        return res.status(500).json(error);
    }


}




function handleFiles(f, folder="uploads"){

    if(!f.length) f = [f];

    return f.map(file=>{
        const ext = file.name.split(".").pop();
        const name = uniqid() + "." + ext;
        file.mv(folder+"/"+name);
        return name;
    });



}