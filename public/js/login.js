const loginForm = document.querySelector("form");
const loginApi = require("../../APIs/loginApi");
loginForm.addEventListener("submit", (Event) => {
  Event.preventDefault();
  loginApi(Event.target[0].value, Event.target[1].value);
});
