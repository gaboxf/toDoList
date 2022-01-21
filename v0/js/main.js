const addBtn = document.getElementById("addBtn"); //elemendo del dom que tiene a addbtn
addBtn.addEventListener("click", addTask); //se le agrega el evento y al finalizar se ejecuta la funcion

function addTask(){
    const taskName = document.getElementById("taskName").value;
    const nodeTask = document.createElement("li");
    nodeTask.innerHTML = 
                    `
                    <div>
                        <input type="checkbox" name="" id="">
                        <span>${taskName}</span>
                    </div>
                    <button id="deleteBtn" onclick="this.parentElement.remove()">
                        <span class="mdi mdi-delete"></span>
                    </button>
                    `;
    const list = document.getElementById("list");
    list.prepend(nodeTask);//agrega un hijo al principio.

    clearInput();
    /*  OPCIONES    */
    //const list = document.querySelector("#list");
    //list.appendChild(task); //agrega un hijo al final.
    //list.insertBefore(nodeTask, list.childNodes[0]);
    //list.insertAdjacentElement("beforebegin", task);
}

function clearInput(){
    let taskName = document.getElementById("taskName");
    taskName.value = "";
}