//check if DOM is loaded, to guarantee execution of code
// Loading hasn't finished yet
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', headerLoadHandler);
}
// DOMContentLoaded has already fired
else {
    headerLoadHandler();
}

//creates Time-Entry with Time class having whatever type is supplied
function createNewTimeEntry(type) {
    let newTimeEntry = document.createElement('div');
    newTimeEntry.setAttribute("class", "time-entry variable");
    newTimeEntry.setAttribute("draggable", "true");
    newTimeEntry.setAttribute("ondrop", "drop_handler(event)");
    newTimeEntry.setAttribute("ondragover", "dragover_handler(event)");
    newTimeEntry.addEventListener("dragstart", timeEntryDragHandler);

    let newTime = document.createElement('div');
    let timeClass = String(type) + " time";
    newTime.setAttribute("class", timeClass);
    // if one or multi, also add click event
    if (type == "one" || type == "multi") {
        newTime.addEventListener('click', oneHourClickHandler);
    }

    let newAction = document.createElement('div');
    newAction.setAttribute("class", "action");

    newTimeEntry.appendChild(newTime);
    newTimeEntry.appendChild(newAction);
    return newTimeEntry;
}

//strip whitespace and return text
function fetchElementTimePart(element, part) {
    if (part == 1)
        return ((element.textContent).trim()).slice(0, 5);
    else
        return ((element.textContent).trim()).slice(6);
}

//returns part which contains XX:30 
function checkHalf(part1, part2) {
    if (part1.slice(3) == 30 && part2.slice(3) != 30) return 1;
    if (part1.slice(3) != 30 && part2.slice(3) == 30) return 2;
    else return 3;
}

//pointers to modal-window and page-1
const modal = document.querySelector("#modal-window");
const page1 = document.querySelector("#page-1");

//show ModalWindow and minimize page1
function displayModalWindow() {
    modal.classList.remove("hide-modal");
    modal.classList.add("show-modal");
    page1.classList.remove("show-page1");
    page1.classList.add("hide-page1");
}

//minimize ModalWindow and show page1
function hideModalWindow(e) {
    modal.classList.remove("show-modal");
    modal.classList.add("hide-modal");
    page1.classList.remove("hide-page1");
    page1.classList.add("show-page1");
}

function resetBorders() {
    timeEntries.forEach(timeEntry => timeEntry.style.border = '');
}


//deletes time-entry divs, from target to dragged index, in the direction provided
function divCleaner(targetIndex, draggedIndex, direction) {
    if (direction == "up") {
        for (let index = draggedIndex; index > targetIndex; index--) {
            container.removeChild(container.children[index])
        }
    }
    else if (direction == "down") {
        for (let index = targetIndex - 1; index >= draggedIndex; index--) {
            container.removeChild(container.children[index])
        }
    }
}

// add class to target div
function classAdder(index) {
    //fetch time parts to compare
    let timeString1 = fetchElementTimePart(container.children[index].firstElementChild, 1);
    let timeString2 = fetchElementTimePart(container.children[index].firstElementChild, 2);

    time1 = parseInt(timeString1.slice(0, 2));
    time2 = parseInt(timeString2.slice(0, 2));

    //check if hhour difference bigger than 1
    if (time2 - time1 > 1) {
        container.children[index].firstElementChild.classList = "multi time";
        container.children[index].firstElementChild.removeEventListener("click", oneHourClickHandler);
    }
    else {
        container.children[index].firstElementChild.classList = "one time";
        container.children[index].firstElementChild.addEventListener('click', oneHourClickHandler);

    }

    //if time is XX:00-YY:30, its half MULTI/ONE
    if (checkHalf(timeString1, timeString2) == 1 || checkHalf(timeString1, timeString2) == 2) {
        container.children[index].firstElementChild.classList.add("half");
    }
}

/*Events*/

/*Event Handler Functions */

//oneHour Click Event Handler function
function oneHourClickHandler(e) {
    let firstPart = fetchElementTimePart(e.target, 1);
    let secondPart = fetchElementTimePart(e.target, 2);
    //if one half
    if (e.target.classList.contains("half") == true) {
        //create new time entry
        newTimeEntry = createNewTimeEntry("one");

        let hour = firstPart.slice(0, 2);
        const intHour = parseInt(hour);

        let newTimeString;
        let updatedTimeString;

        //see which part contains half hour, 1st or 2nd part
        let halfPart = checkHalf(firstPart, secondPart);

        /*The If-Else that appear within the halfPart cases are to properly format timestrings for 1 digit time */

        if (halfPart == 1) {
            //set time for new TimeEntry

            if (intHour < 9) newTimeString = '0' + String(intHour + 1) + ":00-" + secondPart;
            else newTimeString = String(intHour + 1) + ":00-" + secondPart;

            newTimeEntry.firstElementChild.textContent = newTimeString;

            //update existing Time-Entry time range
            if (intHour < 9) updatedTimeString = firstPart + "-0" + String(intHour + 1) + ":00";
            else updatedTimeString = firstPart + "-" + String(intHour + 1) + ":00";

            e.target.textContent = updatedTimeString;

            //insert below target
            (e.target.parentElement).insertAdjacentElement("afterend", newTimeEntry);
        }
        else if (halfPart == 2) {
            //set time for new TimeEntry
            if (intHour < 9) newTimeString = firstPart + "-0" + String(intHour + 1) + ":00";
            else newTimeString = firstPart + "-" + String(intHour + 1) + ":00";

            newTimeEntry.firstElementChild.textContent = newTimeString;

            //update existing Time-Entry time range
            if (intHour < 9) updatedTimeString = '0' + String(intHour + 1) + ":00-" + secondPart;
            else updatedTimeString = String(intHour + 1) + ":00-" + secondPart;

            e.target.textContent = updatedTimeString;

            //insert above target
            (e.target.parentElement).insertAdjacentElement("beforebegin", newTimeEntry);
        }
    }

    //if one
    else {
        //create a new half Time-Entry and insert below target
        newTimeEntry = createNewTimeEntry("half");
        (e.target.parentElement).insertAdjacentElement("afterend", newTimeEntry);

        //set time for new TimeEntry
        let hour = firstPart.slice(0, 2);
        let newTimeString = String(hour) + ":30-" + secondPart;
        newTimeEntry.firstElementChild.textContent = newTimeString;

        //update existing Time-Entry time range
        let updatedTimeString = firstPart + "-" + String(hour) + ":30";
        e.target.textContent = updatedTimeString;
    }

    //change target class and remove one event
    e.target.setAttribute("class", "half time");
    e.target.removeEventListener('click', oneHourClickHandler);
    e.stopPropagation();
}


// action Click Event Handler Code 
//store which element was clicked on 
let actionNode;

function actionClickHandler(e) {
    //check to see if target has action class and is variable
    if ((e.target).classList == 'action' && ((e.target).parentElement).classList.contains('variable')) {
        displayModalWindow();
        actionNode = e.target;
    }
}

// option Click Event Handler Function
function optionClickHandler(e) {
    hideModalWindow();
    chosenOption = e.target.textContent.trim();
    actionNode.textContent = chosenOption;
}

// time-entry Drag Event Handler <<Initialization>> Function
function timeEntryDragHandler(e) {
    //get and store time text by part
    let timeDraggedpart1 = fetchElementTimePart(e.target.firstElementChild, 1);
    let timeDraggedpart2 = fetchElementTimePart(e.target.firstElementChild, 2);

    e.dataTransfer.setData("text/time1", timeDraggedpart1);
    e.dataTransfer.setData("text/time2", timeDraggedpart2);

    //get and store child node number for deletion arithmetic
    let draggedNodeChildIndex = Array.prototype.indexOf.call(container.children, e.target);
    e.dataTransfer.setData("text/node", draggedNodeChildIndex);
}

// time-entry DRAGOVER Event Handler Function 
function dragover_handler(e) {
    //prevent default dragover action
    e.preventDefault();

    // making sure that time-entry is selected as target
    let target = e.target;
    if (e.target.classList.contains('time') || e.target.classList.contains('action')) {
        target = e.target.parentElement;
    }
    // highlight effect
    e.dataTransfer.dropEffect = "move";
    target.style.border = '2px solid orange';
}

// time-entry Drop Event Handler Function
function drop_handler(e) {
    e.preventDefault();
    //make sure target is time-entry div
    let target = e.target;
    if (e.target.classList.contains('time') || e.target.classList.contains('action')) {
        target = e.target.parentElement;
    }
    //fetch data
    let draggedNodeChildIndex = e.dataTransfer.getData("text/node");
    let draggedTime1 = e.dataTransfer.getData("text/time1");
    let draggedTime2 = e.dataTransfer.getData("text/time2");

    //find required vars
    let targetNodeChildIndex = Array.prototype.indexOf.call(container.children, target);
    targetTime1 = fetchElementTimePart(target.firstElementChild, 1);
    targetTime2 = fetchElementTimePart(target.firstElementChild, 2);

    //if dragged up
    if (draggedNodeChildIndex > targetNodeChildIndex) {
        //time becomes -> target:hour => 1st part of target time + 2nd part of dragged Element time
        newTimeString = targetTime1 + '-' + draggedTime2;
        divCleaner(targetNodeChildIndex, draggedNodeChildIndex, "up");
    }

    //if dragged down
    else if (draggedNodeChildIndex < targetNodeChildIndex) {
        //time becomes -> dragged:target => 1st part of dragged time + 2nd part of target time
        newTimeString = draggedTime1 + '-' + targetTime2;
        divCleaner(targetNodeChildIndex, draggedNodeChildIndex, "down");
    }

    //if drag to same place, do nothing
    else {
        return;
    }

    targetNodeChildIndex = Array.prototype.indexOf.call(container.children, target);
    target.firstElementChild.textContent = newTimeString;

    //change class of target element
    classAdder(targetNodeChildIndex);

    //RESET BORDERS BROKEN
    resetBorders();
    target.style.border = ''
}

// DOM Content Loaded Event Handler Function
function headerLoadHandler() {
    // getting day using Date/Time Format to get it in words
    const date = new Date();
    dayString = date.toLocaleDateString('en-US', { weekday: 'long', });
    let dayNode = document.querySelector("#day");
    dayNode.textContent = dayString;

    // getting date
    const today = new Date();
    todayDate = today.getDate();
    todayMonth = today.getMonth() + 1;
    todayYear = today.getFullYear();

    //formatting month string
    if (todayMonth / 10 != 0) {
        todayMonth = '0' + String(todayMonth);
    }

    const dateString = String(todayDate) + '/' + String(todayMonth) + '/' + String(todayYear);
    let dateNode = document.querySelector("#date");
    dateNode.textContent = dateString;
}

/*Event Listeners */

// one hour --Time-Entry-- click event 
let oneHours = document.querySelectorAll(".one");
oneHours.forEach(oneHour => {
    oneHour.addEventListener('click', oneHourClickHandler);
});

// bubble up --Action-- Click Event
container.addEventListener("click", actionClickHandler);

// --svg-- Click Event
let svg = document.querySelector("svg");
svg.addEventListener("click", hideModalWindow);

// --options-- Click Event
let options = document.querySelectorAll(".options");
options.forEach(option => {
    option.addEventListener("click", optionClickHandler);
});

// --TimeEntry-- Drag Event 
let timeEntries = document.querySelectorAll(".variable");
timeEntries.forEach(timeEntry => {
    // make every variable time-entry element draggable and drop target
    timeEntry.setAttribute("draggable", "true");
    timeEntry.setAttribute("ondrop", "drop_handler(event)");
    timeEntry.setAttribute("ondragover", "dragover_handler(event)");
    timeEntry.addEventListener("dragstart", timeEntryDragHandler);
});

