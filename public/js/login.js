const loginForm = document.querySelector("form");
const myHeaders = new Headers();
loginForm.addEventListener("submit", async (Event) => {
  Event.preventDefault();
  if (Event.submitter.id == "signIn") {
    //if signing in
    try {
      if (!Event.target[0].value || !Event.target[1].value) {
        alert("Please provide all required fields");
        throw new Error("All required fields not provided");
      }
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
      await fetch("http://localhost:3000/user/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          //show tasks page
          alert("Welcome" + result.user.name);
          console.log(result);
        });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("signUp");
  }
});
