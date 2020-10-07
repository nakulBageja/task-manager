require("../src/db/mongoose");
const tasks = require("../src/models/task");

// tasks
//   .findOneAndUpdate({ description: "Go for workout" }, { completed: true })
//   .then(task => {
//     console.log(task);
//     return tasks.countDocuments({ completed: false });
//   })
//   .then(count => {
//     console.log(count);
//   })
//   .catch(error => {
//     console.log(error);
//   });

const deleteTaskAndCount = async description => {
  const task = await tasks.findOneAndDelete({ description });
  const count = await tasks.countDocuments();
  return count;
};

deleteTaskAndCount("Go for workout")
  .then(count => {
    console.log(count);
  })
  .catch(error => {
    console.log(error);
  });
