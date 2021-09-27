let tasks = []; //lista de tareas
let geo = {
    lat: null,
    lon: null
} //almacenamiento de la geolocalizacion

const addBtn = document.querySelector("#addBtn");
const taskInput = document.getElementById("taskName");

//Eventos para añadir una nueva tarea
document.addEventListener("keypress", event =>{
    if(event.key === "Enter"){
        if (taskInput.value != "") {
            const nTask = {
                taskId: setID(4),
                taskName: taskInput.value,
                done: false,
                geo: geo
            }
            tasks.push(nTask);
    
            setTasksLocalStorage(); //añade el nuevo cambio de la lista al local storage

            addTask(nTask);
        }
    }});
addBtn.addEventListener("click", evento =>{
    evento.preventDefault();

    if (taskInput.value != "") {
        
        const nTask = {
            taskId: setID(4),
            taskName: taskInput.value,
            done: false,
            geo: geo
        }
        tasks.push(nTask);

        setTasksLocalStorage(); //añade el nuevo cambio de la lista al local storage

        addTask(nTask);
    }
});

//Eventos para detectar el lugar donde hacemos click
const toDoList = document.querySelector("#todolist");
toDoList.addEventListener("click", evento => {
    const selected = evento.target.closest("li").getAttribute("id");

    //console.log("Primero: "+ (evento.target.parentElement.getAttribute("id"))+", Segundo: "+ selected);
    if (evento.target.parentElement.getAttribute("id") == selected && evento.target.closest("input").getAttribute("id") == "deleteBtn") {
        deleteTask(selected);
    }
    if (evento.target.parentElement.getAttribute("id") == selected && evento.target.closest("input").getAttribute("id") == "shareBtn") {
        shareTask(selected);
    }
    if (evento.target.parentElement.getAttribute("id") == selected && evento.target.closest("input").getAttribute("id") == "copyBtn") {
        clipboard(selected);
    }
    if (evento.target.parentElement.getAttribute("id") == selected && evento.target.closest("input").getAttribute("id") == "checkboxBtn") {
        //no detecta el click en el checkbox
        checked(selected);
    }
});

//Evento de full screen
const fsBtn = document.getElementById("screen");
fsBtn.addEventListener("click", fullScreen);

//FUNCIONES
function addTask(task){
    const nodeTask = document.createElement("li");
    nodeTask.setAttribute("id", task.taskId);
    nodeTask.innerHTML = 
                    `
                    <div>
                        <input type="checkbox" name="" id="checkboxBtn">
                        <span>${task.taskName}</span>    
                    </div>
                    <input type="button" value="Copy" id="copyBtn">
                    <input type="button" value="Share" id="shareBtn">
                    <input type="button" value="X" id="deleteBtn">
                    `;
    
    toDoList.prepend(nodeTask);//agrega un hijo al principio.
    clearInput();
}

function clearInput(){
    let taskName = document.getElementById("taskName");
    taskName.value = "";
}

function deleteTask(id){
    document.getElementById(id).remove();
    tasks = tasks.filter(task => task.taskId != id);
    setTasksLocalStorage();
}

function setID(longitud){
    let id = '';
    let caracteres = '0123456789';

    if (typeof longitud != 'number') {
        throw Error('El argumento debe ser un numero');
    }

    for (let i = 0; i < longitud; i++) {
        id += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
    }

    return id;
}

function fullScreen(){
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fsBtn.innerText = "Exit";
    }else{
        if (document.exitFullscreen){
            document.exitFullscreen();
            fsBtn.innerText = "Full Screen";
        }
    }
}

function shareTask(id) {
    if (!("share" in navigator)) {
      alert('Web Share API not supported.');
      return;
    }

    const task = tasks.filter(t => t.taskId == id)[0]
    navigator.share({
        title: 'To-do List',
        text: task.taskName,
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

function checked(id){
    tasks[tasks.findIndex(task => task.taskId == id)].done = document.getElementById(id).children[0].children[0].checked;
    setTasksLocalStorage();
    console.log("Task checked");
}

function setTasksLocalStorage(){
    if ('localStorage' in window || 'sessionStorage' in window) {
        //Crea o modifica el local storage
        localStorage.setItem("tasks", JSON.stringify(tasks)); //convertimos la lista de objetos JASON en string
        console.log("Local Storage SET correctly");
    } else {
        console.error("Local Storage not suported..");
    }
}

function getTasksLocalStorage(){
    if ('localStorage' in window || 'sessionStorage' in window) {
        return JSON.parse(localStorage.getItem("tasks"));
    } else {
        return [];
    }
}

function getGlocation(){
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function (location) {
                geo.lat = location.coords.latitude;
                geo.lon = location.coords.longitude;
            },
            function (err) {
                console.warn(err);
                geo.lat = null;
                geo.lon = null;
            }
        );
    } else {
        return null;
    }
}

//Funciones a ejecutar con la carga de la página
window.onload = function(){
    //Guarda los objetos almacenados del LS en nuestra lista de tareas
    tasks = getTasksLocalStorage();

    //Recorre la lista añadiendo cada tarea nuevamente a la pagina
    tasks.map(function (task){
        addTask(task);
    });

    //Solicita la geolocalizacion al cargar la pagina
    getGlocation();
}
