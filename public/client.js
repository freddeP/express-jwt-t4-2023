console.log("client script");

// Add listener to guitarsContainer
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

async function deleteGuitar(href){

    let response = await fetch(href, {
        method:"DELETE"
    });

    response = await response.json();

    if(response.id) document.getElementById(response.id).remove();
 
}