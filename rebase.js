//creates Time-Entry with Time class having whatever type is supplied
function createNewTimeEntry(type) {
    let newTimeEntry = document.createElement('div');
    newTimeEntry.setAttribute("class", "time-entry variable");
    newTimeEntry.setAttribute("draggable", "true");
    newTimeEntry.setAttribute("ondrop", "drop_handler(event)");
    newTimeEntry.setAttribute("ondragover", "dragover_handler(event)");
    let newTime = document.createElement('div');
    let timeClass = String(type) + " time";
    newTime.setAttribute("class", timeClass);
    // if one or multi, also add click event
    if (type == "one" || type == "multi"){
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


/*Events*/

//oneHour Click Event Handler function
function oneHourClickHandler(e) {
    let firstPart = fetchElementTimePart(e.target, 1);
    let secondPart = fetchElementTimePart(e.target, 2);
    //if one half
    if (e.target.classList.contains("half") == true) {
        //create new time entry
        newTimeEntry = createNewTimeEntry("one");

        //see which part contains half hour, 1st or 2nd part
        let halfPart = checkHalf(firstPart, secondPart);
        if (halfPart == 1) {
            //set time for new TimeEntry
            let hour = firstPart.slice(0, 2);
            let newTimeString = String(parseInt(hour)+1) + ":00-" + secondPart;
            newTimeEntry.firstElementChild.textContent = newTimeString;

            //update existing Time-Entry time range
            let updatedTimeString = firstPart + "-" + String(parseInt(hour)+1) + ":00";
            e.target.textContent = updatedTimeString;

            //insert below target
            (e.target.parentElement).insertAdjacentElement("afterend", newTimeEntry);
        }
        else if (halfPart == 2) {
            //set time for new TimeEntry
            let hour = firstPart.slice(0, 2);
            let newTimeString = firstPart + "-" + String(parseInt(hour)+1) + ":00";
            newTimeEntry.firstElementChild.textContent = newTimeString;      

            //update existing Time-Entry time range
            let updatedTimeString = String(parseInt(hour)+1) + ":00-" + secondPart;
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

// one hour time-entry click event 
let oneHours = document.querySelectorAll(".one");
oneHours.forEach(oneHour => {
    oneHour.addEventListener('click', oneHourClickHandler);
});