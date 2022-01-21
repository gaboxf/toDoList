const addBtn = document.querySelector("#addBtn");
const taskInput = document.getElementById("taskName");
addBtn.addEventListener("click", evento => {
    evento.preventDefault();

    if (taskInput.value != "") {
        addTask();
    }
});
document.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        if (taskInput.value != "") {
            addTask();
        }
    }
});

const toDoList = document.querySelector("#todolist");

toDoList.addEventListener("click", evento => {

    //console.log("Primero: "+ (evento.target.parentElement.getAttribute("id"))+", Segundo: "+ selected);

    try {
        if (evento.target.closest("button").getAttribute("id") == "deleteBtn") {
            deleteTask(evento.target.closest("li").getAttribute("id"));
        }
        if (evento.target.closest("button").getAttribute("id") == "shareBtn") {
            shareTask(evento.target.closest("li").getAttribute("id"));
        }
        if (evento.target.closest("button").getAttribute("id") == "copyBtn") {
            clipboard(evento.target.closest("li").getAttribute("id"));
        }
    } catch (error) {
        /* Error controlado al hacer click fuera del area que necesito comprobar */
    }
});

const fsBtn = document.getElementById("fsBtn");
fsBtn.addEventListener("click", fullScreen);
function addTask() {
    const taskName = document.getElementById("taskName").value;
    const nodeTask = document.createElement("li");
    nodeTask.setAttribute("id", setID(4));
    nodeTask.innerHTML =
        `
                    <div class="taskContent">
                        <input type="checkbox" name="" id="">
                        <span>${taskName}</span>    
                    </div>
                    <div class="taskButtons">
                        <button type="submit" id="copyBtn">
                            <span class="mdi mdi-clipboard-multiple-outline"></span>
                        </button>
                        <button type="submit" id="shareBtn">
                            <span class="mdi mdi-share-variant"></span>
                        </button>
                        <button type="submit" id="deleteBtn">
                            <span class="mdi mdi-delete"></span>
                        </button>
                    </div>
                    `;

    toDoList.prepend(nodeTask);//agrega un hijo al principio.

    clearInput();
}

function clearInput() {
    let taskName = document.getElementById("taskName");
    taskName.value = "";
}

function deleteTask(id) {
    document.getElementById(id).remove();
}

function setID(longitud) {
    let id = '';
    let caracteres = '0123456789';

    if (typeof longitud != 'number') {
        throw Error('El argumento debe ser un numero');
    }

    for (let i = 0; i < longitud; i++) {
        id += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return id;
}

function fullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fsBtn.firstElementChild.setAttribute('class', 'mdi mdi-fullscreen-exit');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            fsBtn.firstElementChild.setAttribute('class', 'mdi mdi-fullscreen');
        }
    }
}

function shareTask(id) {
    if (!("share" in navigator)) {
        alert('Web Share API not supported.');
        return;
    }

    const text = document.getElementById(id);
    const textContent = text.querySelector("span").textContent;
    navigator.share({
        title: 'To-do List',
        text: textContent,
        url: 'https://whatwebcando.today/'
    })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing:', error));
}

function clipboard(id) {
    const text = document.getElementById(id);
    const textContent = text.querySelector("span").textContent;

    navigator.clipboard.writeText(textContent)
        .then(() => console.log('Copy writeText successful, "' + textContent + '" written'))
        .catch(err => console.log('Copy writeText failed with error: "' + err + '"'));
}