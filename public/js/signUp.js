const signUpForm = document.querySelector("form");
var myHeaders = new Headers();

signUpForm.addEventListener("submit", async (Event) => {
  Event.preventDefault();
  try {
    if (Event.submitter.id == "signUp") {
      if (!Event.target[0].value || !Event.target[1].value) {
        //if all the values are not provided
        console.log("Afaf");
        throw new Error("All required fields not provided");
      }
      //body of request call
      const raw = JSON.stringify({
        name: Event.target[0].value,
        email: Event.target[1].value,
        password: Event.target[2].value,
        age: Event.target[3].value,
      });
      myHeaders.append("Content-Type", "application/json");
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };
      const response = await fetch(
        "http://localhost:3000/user",
        requestOptions
      );
      const result = await response.json();
      if (response.status == 400) {
        //  if status is 400 then throw error
        throw new Error(result.errors.password.message);
      }
      signUpForm.reset();
      alert("Welcome " + result.newUser.name);
    }
  } catch (error) {
    alert(error.message);
    console.log(error);
  }
});
