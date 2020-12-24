//toggle modes from dark to light mode
const changeMode = () => {
  let element = document.getElementById("mode");
  if (element.getAttribute("value") == "dark") {
    document.documentElement.setAttribute("data-theme", "light"); //changing the root element prop.
    element.setAttribute("value", "light"); //changing child element prop
    element.setAttribute("src", "./images/icon-moon.svg");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    element.setAttribute("value", "dark");
    element.setAttribute("src", "./images/icon-sun.svg");
  }
};
// function to add a new task
const newTaskElement = document.getElementById("newTask");

newTaskElement.onkeydown = (Event) => {
  if (Event.keyCode == 13) {
    //when enter key is pressed add the task
    Event.preventDefault();
    const val = Event.target.value; // task the value entered
    if (val.length == 0) {
      window.alert("Please write a text");
      return;
    }
    //appending the value to the list of tasks
    let div = document.createElement("div"); //create the div element
    div.className = "boxList";
    let para = document.createElement("p"); //create the para element
    let node = document.createTextNode(val);
    para.appendChild(node);
    let button = document.createElement("button"); //create the button element
    button.className = "button"; //adding the class name for css
    let block = document.getElementsByClassName("taskContainer");
    div.appendChild(button);
    div.appendChild(para);
    block[0].prepend(div);
    newTaskElement.value = ""; //reseting the value of input
  }
};

//updating the status of task
const statusUpdation = () => {};
