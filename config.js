//time-click functionality

//create Time-Entry Div and fill time with text
function createNewTimeEntry(hour) {
    //create new time-entry div
    let newTimeEntry = document.createElement('div');
    newTimeEntry.setAttribute("class", "time-entry variable");
    newTimeEntry.setAttribute("draggable", "true");
    newTimeEntry.setAttribute("ondrop", "drop_handler(event)");
    newTimeEntry.setAttribute("ondragover", "dragover_handler(event)");
    let newTime = document.createElement('div');
    newTime.setAttribute("class", "half time")
    let newAction = document.createElement('div');
    newAction.setAttribute("class", "action")
    newTimeEntry.appendChild(newTime);
    newTimeEntry.appendChild(newAction);
    intHour = parseInt(hour);
    if (intHour < 9) {
        hourString = String(hour) + ":30-0" + String(intHour + 1) + ":00";
    }
    else {
        hourString = String(hour) + ":30-" + String(intHour + 1) + ":00";
    }

    newTime.textContent = hourString;
    return newTimeEntry;
}

//strip whitespace and return text
function fetchElementText(element) {
    return (element.textContent).trim();
}

// one hour time-entry click event 
let oneHours = document.querySelectorAll(".one");
oneHours.forEach(oneHour => {
    oneHour.addEventListener('click', function oneHourClickHandler(e) {
        hour = (fetchElementText(oneHour)).slice(0, 2);
        newTimeEntry = createNewTimeEntry(hour);
        (oneHour.parentElement).insertAdjacentElement("afterend", newTimeEntry);
        updatedHourString = String(hour) + ":00-" + String(hour) + ":30";
        oneHour.textContent = updatedHourString;
        oneHour.setAttribute("class", "half time");
        oneHour.removeEventListener('click', oneHourClickHandler);
        //dont let event bubble
        e.stopPropagation();
    }
    )
});


//modal window 
const modal = document.querySelector("#modal-window");
const page1 = document.querySelector("#page-1");

function displayModalWindow() {
    modal.classList.remove("hide-modal");
    modal.classList.add("show-modal");
    page1.classList.remove("show-page1");
    page1.classList.add("hide-page1");
}

function hideModalWindow(e) {
    modal.classList.remove("show-modal");
    modal.classList.add("hide-modal");
    page1.classList.remove("hide-page1");
    page1.classList.add("show-page1");
}

//store which element was clicked on 
let actionNode;

// bubble up action click event handler
let container = document.querySelector("#container");
container.addEventListener("click", (e) => {
    //check to see if target has action class and is variable
    if ((e.target).classList == 'action' && ((e.target).parentElement).classList.contains('variable')) {
        displayModalWindow();
        actionNode = e.target;
    }
});

let svg = document.querySelector("svg");
svg.addEventListener("click", hideModalWindow);

let options = document.querySelectorAll(".options");
options.forEach(option => {
    option.addEventListener("click", () => {
        hideModalWindow();
        chosenOption = fetchElementText(option);
        console.log(chosenOption);
        actionNode.textContent = chosenOption;
    });
});

function divCleaner(targetIndex, draggedIndex, direction){
    if (direction == "up"){
        for (let index = draggedIndex; index > targetIndex; index--){
            container.removeChild(container.children[index])
        }
    }
    else if (direction == "down"){
        for (let index = targetIndex-1; index >= draggedIndex; index--){
            container.removeChild(container.children[index])
        }
}}

function classAdder(index){
    let timeString = fetchElementText(container.children[index].firstElementChild);
    time1 = parseInt(timeString.slice(0,2));
    time2 = parseInt(timeString.slice(6,8));
    if (time2 - time1 > 1){
        container.children[index].firstElementChild.classList = "multi time";
    }
    else {
        container.children[index].firstElementChild.classList = "one time";
    }

    //if time is XX:00-YY:30, its half MULTI/ONE
    if (fetchElementText(container.children[index].firstElementChild).slice(3,5) != fetchElementText(container.children[index].firstElementChild).slice(9)){
        container.children[end].firstElementChild.classList.add("half");
    }
    
}

function drop_handler(e) {
    e.preventDefault();
    let target = e.target;
    if (e.target.classList.contains('time') || e.target.classList.contains('action')){
        target = e.target.parentElement;
    }
    let draggedNodeChildIndex = e.dataTransfer.getData("text/node");
    let targetNodeChildIndex = Array.prototype.indexOf.call(container.children, target);
    let newTimeString;
    let draggedTime = e.dataTransfer.getData("text/time");
    //if dragged up
    if (draggedNodeChildIndex > targetNodeChildIndex) {
        draggedHour = draggedTime.slice(6);
        targetHour = (fetchElementText(target.firstElementChild)).slice(0, 5);
        //targetHour:dragHour
        newTimeString = String(targetHour) + '-' + String(draggedHour);
        divCleaner(targetNodeChildIndex, draggedNodeChildIndex, "up");
        
    }
    //if dragged down
    else if (draggedNodeChildIndex < targetNodeChildIndex) {
        draggedHour = draggedTime.slice(0, 5);
        targetHour = (fetchElementText(target.firstElementChild)).slice(6);
        //dragHour:targetHour
        newTimeString = String(draggedHour) + '-' + String(targetHour);
        divCleaner(targetNodeChildIndex, draggedNodeChildIndex, "down");
    }
    //if drag to same place
    else {
        return;
    }
    targetNodeChildIndex = Array.prototype.indexOf.call(container.children, target);
    target.firstElementChild.textContent = newTimeString;
    classAdder(targetNodeChildIndex);
    target.style.border = '';

    //test and see which class to add to the target div (one or multi)
}

function dragover_handler(e) {
    e.preventDefault();
    let target = e.target;
    if (e.target.classList.contains('time') || e.target.classList.contains('action')){
        target = e.target.parentElement;
    }
    e.dataTransfer.dropEffect = "move";
    target.style.border = '2px solid orange';
}

let timeEntries = document.querySelectorAll(".variable");
timeEntries.forEach(timeEntry => {
    timeEntry.setAttribute("draggable", "true");
    timeEntry.setAttribute("ondrop", "drop_handler(event)");
    timeEntry.setAttribute("ondragover", "dragover_handler(event)");
    timeEntry.addEventListener("dragstart", (e) => {
        //get textContent of time, not actiont
        let timeDragged = fetchElementText((e.target).firstElementChild);
        let draggedNodeChildIndex = Array.prototype.indexOf.call(container.children, e.target);
        e.dataTransfer.setData("text/node", draggedNodeChildIndex);
        e.dataTransfer.setData("text/time", timeDragged);
    })
});