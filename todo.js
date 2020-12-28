const toDoForm = document.querySelector(".js-toDoForm"),
    toDoInput = toDoForm.querySelector("input"),
    toDoList = document.querySelector(".js-toDoList"),
    checkedToDoList = document.querySelector(".js-checkedToDoList"),
    clearBtn = document.querySelector(".js-clear-button");

const TODOS_LS = 'toDos';
const CHECKED_LS = 'checkedToDos';

let toDos = [];
let checkedToDos = [];

function clearCompleted(){
    // checked list의 li 제거(HTML)
    while (checkedToDoList.firstChild) {
        checkedToDoList.removeChild(checkedToDoList.lastChild);
    }
    // LS에서 제거
    checkedToDos = [];
    saveToDos(CHECKED_LS);
}

function deleteToDo(event){
    const btn = event.target;
    const li = btn.parentNode;
    const listName = event.path[2]; //클릭된 버튼의 상위클래스
    //체크되지 않은것과 체크된것 나눠서 삭제
    if (listName.classList.contains('toDoList')){
        toDoList.removeChild(li);
        cleanToDos(toDos, li.id);
        saveToDos(TODOS_LS);
    } else {
        checkedToDoList.removeChild(li);
        cleanToDos(checkedToDos, li.id);
        saveToDos(CHECKED_LS);
    }
}

function unCheckToDo(event){
    const btn = event.target;
    const li = btn.parentNode;
    const checkBtn = li.querySelector(".fa-check-square");
    const line = li.querySelector("#strikeout");
    // checked list에 li 추가(HTML)
    checkBtn.classList.remove("fa-check-square");
    checkBtn.classList.add("fa-square");
    checkBtn.removeEventListener("click", unCheckToDo);
    checkBtn.addEventListener("click", checkToDo);
    li.removeChild(line);
    toDoList.appendChild(li);
    
    selectedToDo(checkedToDos, li.id);
    cleanToDos(checkedToDos, li.id);
    saveToDos(TODOS_LS);
    saveToDos(CHECKED_LS);
}

function cleanToDos(TODOS, id){
    // 클릭되지 않은것 - cleanToDos에 넣음
    const cleanToDos = TODOS.filter(function(todo){
        return JSON.stringify(todo.id) !== id;
    })
    // 남은것들 남겨둠
    switch(TODOS){
        case toDos:
            toDos = cleanToDos;
            break;
        case checkedToDos:
            checkedToDos = cleanToDos;
            break;
    }
}

function selectedToDo(TODOS, id){
    // 클릭된 것 골라서 clickedToDos에 넣음
    const clickedToDo = TODOS.filter(function(toDo){
        return JSON.stringify(toDo.id) === id;
    })
    // 클릭된 것은 옮겨질 list 뒤에 붙임
    switch(TODOS){
        case toDos:
            checkedToDos = checkedToDos.concat(clickedToDo);
            break;
        case checkedToDos:
            toDos = toDos.concat(clickedToDo);
            break;
    }
}

function checkToDo(event){
    const btn = event.target;
    const li = btn.parentNode;
    const checkBtn = li.querySelector(".fa-square");
    const line = document.createElement("div");
    // checked list에 li 추가(HTML)
    checkBtn.classList.remove("fa-square");
    checkBtn.classList.add("fa-check-square");
    checkBtn.removeEventListener("click", checkToDo);
    checkBtn.addEventListener("click", unCheckToDo);
    li.appendChild(line);
    line.id = 'strikeout';
    checkedToDoList.appendChild(li);
    
    selectedToDo(toDos, li.id);
    cleanToDos(toDos, li.id);
    saveToDos(TODOS_LS);
    saveToDos(CHECKED_LS);
}

//각각 Local Storage에 저장
function saveToDos(LS){
    switch(LS) {
        case CHECKED_LS :
            localStorage.setItem(CHECKED_LS, JSON.stringify(checkedToDos));
            break;
        case TODOS_LS :
            localStorage.setItem(TODOS_LS, JSON.stringify(toDos));
            break;
    }
    
}

function paintToDo(text, LS){
    const li = document.createElement("li");
    const textli = document.createElement("span");
    const checkBtn = document.createElement("icon");
    const checkedBtn = document.createElement("icon");
    const delBtn = document.createElement("icon");
    const newId = Date.now() + Math.random();
    const line = document.createElement("div");
    const toDoObj = {
        text: text,
        id: newId
    }
    
    textli.innerHTML = text;
    checkBtn.classList.add('far', 'fa-square');
    checkedBtn.classList.add('far', "fa-check-square");
    delBtn.classList.add('far', 'fa-trash-alt');
    checkBtn.addEventListener("click", checkToDo);
    checkedBtn.addEventListener("click", unCheckToDo);
    delBtn.addEventListener("click", deleteToDo);
    delBtn.id = "delBtn";
    line.id = 'strikeout';
    li.id = newId;

    switch(LS){
        case TODOS_LS:
            li.appendChild(checkBtn);
            li.appendChild(textli);
            li.appendChild(delBtn);
            toDoList.appendChild(li);
            toDos.push(toDoObj);
            saveToDos(TODOS_LS);
            break;
        case CHECKED_LS:
            li.appendChild(checkedBtn);
            li.appendChild(textli);
            li.appendChild(delBtn);
            li.appendChild(line);
            checkedToDoList.appendChild(li);
            checkedToDos.push(toDoObj);
            saveToDos(CHECKED_LS);
            break;
    }
}

function handleSubmitToDo(event){
    event.preventDefault();
    const currentValue = toDoInput.value;
    paintToDo(currentValue, TODOS_LS);
    toDoInput.value = ""; //submit 후 input창 초기화
}

function loadToDos(LS){
    const loadedToDos = localStorage.getItem(LS);
    if (loadedToDos !== null){
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo){
            paintToDo(toDo.text, LS);
        })
    }
}

function init(){
    loadToDos(TODOS_LS);
    loadToDos(CHECKED_LS);
    toDoForm.addEventListener("submit", handleSubmitToDo);
    clearBtn.addEventListener("click", clearCompleted);
}
init();