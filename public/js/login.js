const loginForm = document.querySelector("form");
const myHeaders = new Headers();

loginForm.addEventListener("submit", async (Event) => {
  Event.preventDefault();

  if (Event.submitter.id == "signIn") {
    //if signing in
    try {
      if (!Event.target[0].value || !Event.target[1].value) {
        //if all the values are not provided
        alert("Please provide all required fields");
        throw new Error("All required fields not provided");
      }
      //body of request call
      const raw = JSON.stringify({
        email: Event.target[0].value,
        password: Event.target[1].value,
      });

      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        "https://nakul-task-manager.herokuapp.com/user/login",
        requestOptions
      );
      if (response.status == 400) {
        //  if status is 400 then throw error
        throw new Error("Unable to login, Please Check your credentials");
      }
      const result = await response.json();
      alert("Welcome " + result.user.name);
    } catch (error) {
      loginForm.reset();
      alert(error.message);
      console.log(error);
    }
  }
});
