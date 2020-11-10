### Task Manager APP

## Asynchronous functionalities

- Instead of using callbacks like we did before, we will be using Promise now.
- Promise works just like callbacks but has some syntactical advantages which are useful for a developer

# Usage of async await much more cleaner and gives a look of synchronous programming

## Tools used

- MongoDb
- Robo 3T - GUI for mongoDb
- NodeJs
- handlebars
- mongoosejs - This is used to:
  - Model our mongoDb easily
  - To provide easy validations and structuring of collections
- Use of npm validator module present for validations

## Checking documentation of mongoose for better understanding

## Hashing password

- using bcrypt
- adding the hashing feature to the model rather than the router by using middleware feature of mongoose

## Token

- used jsonwebtoken to generate token for authentication
- this token is generated whenever a user logs in or make an account
- This token is used to restrict malicious attempts
