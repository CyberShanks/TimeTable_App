function oneHourClickHandler(oneHour) {

}

let oneHours = document.querySelectorAll(".one");
oneHours.forEach(oneHour => {
    oneHour.addEventListener('click', function oneHourClickHandler() {
        hour = (fetchElementText(oneHour)).slice(0, 2);
        newTimeEntry = createNewTimeEntry(hour);
        (oneHour.parentElement).insertAdjacentElement("afterend", newTimeEntry);
        updatedHourString = String(hour) + ":00-" + String(hour) + ":30";
        oneHour.textContent = updatedHourString;
        oneHour.setAttribute("class", "half time");
        oneHour.removeEventListener('click', oneHourClickHandler);
        //hour = text within
        //create another time-entry div with time text = hour:30-hour+1:00, action remains same
        //change text within time to hour:00-hour:30
    }
    )
})

function createNewTimeEntry(hour) {
    //create new time-entry div
    let newTimeEntry = document.createElement('div');
    newTimeEntry.setAttribute("class", "time-entry");
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