console.log("client script");

// Add listener to guitarsContainer
if(document.querySelector(".guitarContainer"))
{
    document.querySelector(".guitarContainer").
    addEventListener('click', async (ev)=>{

        ev.preventDefault();

        console.log(ev.target.href);

        if(ev.target.dataset.type){
            console.log(ev.target.dataset.type);

            if(ev.target.dataset.type == "delete")
            {
                await deleteGuitar(ev.target.href);
            }
        }
    });
}


async function deleteGuitar(href){

    let response = await fetch(href, {
        method:"DELETE"
    });

    response = await response.json();

    if(response.id) document.getElementById(response.id).remove();
 
}

/* if(document.querySelector("#createGuitar"))
document.querySelector("#createGuitar").addEventListener("submit", handleCreate);



async function handleCreate(ev){

    ev.preventDefault();
    let data = new FormData(ev.target);
    data.append("client", true);

    let response = await fetch("/guitars",{
        method:"POST",
        credentials:"include",
        body:data
    });
    response = await response.text();
    console.log(response);

} */