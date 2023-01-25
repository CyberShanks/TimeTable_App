//time-click functionality

//create Time-Entry Div and fill time with text
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
})


//modal window 
const modal = document.querySelector("#modal-window");
const page1 = document.querySelector("#page-1");

function displayModalWindow(){
    modal.classList.remove("hide-modal");
    modal.classList.add("show-modal");
    page1.classList.remove("show-page1");
    page1.classList.add("hide-page1");
}

function hideModalWindow(e){
    modal.classList.remove("show-modal");
    modal.classList.add("hide-modal");
    page1.classList.remove("hide-page1");
    page1.classList.add("show-page1");
}

let actionNode;

// bubble up action click event handler
let container = document.querySelector("#container");
container.addEventListener("click", (e) => {
    //check to see if target has action class
    if ((e.target).classList == 'action' && ((e.target).parentElement).classList.contains('variable')){
        displayModalWindow();
        actionNode = e.target;
    }
})

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
})




