var request = require("request");

const loginApi = (email, password) => {
  var options = {
    method: "POST",
    url: "/user/login",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
};
module.exports = loginApi;
