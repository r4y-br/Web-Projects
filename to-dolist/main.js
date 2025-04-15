const tache = document.querySelector("#input-box");
const userList = document.querySelector('#list-container');

function addTask (){
    if(tache.value===""){
        alert("you must write something !")}

    else{
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(`${tache.value}`));
        userList.appendChild(li);
        let span =document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    tache.value="";
    savedata();
}

userList.addEventListener('click' ,function(e){
    if(e.target.tagName==="LI"){
        e.target.classList.toggle("checked");
        savedata();

    }
    else if(e.target.tagName==="SPAN"){
        e.target.parentElement.remove();
        savedata();
    }
},false);
function savedata(){
    localStorage.setItem('data',userList.innerHTML)
}
function showTask(){
    userList.innerHTML = localStorage.getItem('data');

}
showTask();