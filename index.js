import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

const isValidDate = (date) => {
  const startDate = moment("2019-01-01");
  const endDate = moment("2025-12-31");
  return date.isBetween(startDate, endDate, null, "[]");
};

const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(path, data);

  const git = simpleGit();
  await git.add([path]);
  await git.commit(
    "Auto commit " + moment(date).format("HH:mm:ss DD/MM/YYYY"),
    {
      "--date": date.toISOString(),
    }
  );
};

const makeCommits = async (n) => {
  const git = simpleGit();

  for (let i = 0; i < n; i++) {
    const randomDate = moment();

    if (isValidDate(randomDate)) {
      console.log(
        "Creating commit: " + moment(randomDate).format("HH:mm:ss DD/MM/YYYY")
      );
      await markCommit(randomDate);
    } else {
      console.log(
        "Invalid date: " + moment(randomDate).format("HH:mm:ss DD/MM/YYYY")
      );
    }
  }

  console.log("Pushing all commits to remote...");
  await git.push();
};

makeCommits(50000);
