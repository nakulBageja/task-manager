require("../src/db/mongoose");
const tasks = require("../src/models/task");

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
