import Octokat from "octokat";

function auth(token) {
  return new Octokat({
    token: token,
    acceptHeader: "application/vnd.github.mercy-preview+json"
  });
}

export function getRepos(token) {
  const octokat = auth(token);
  return octokat
    .orgs("karnov")
    .repos.fetchAll()
    .catch(err => console.error(err));
}

// export function getLastCommit(token, repo_name) {
//   const octokat = auth(token);
//   return octokat
//     .repos("karnov", repo_name)
//     .commits.fetchAll()
//     .catch(err => console.error(err));
// }

export function update(token, repo_name, key, value) {
  switch (key) {
    case "description":
      // github.updateRepoDescription(token, repo_name, value);
      break;
    case "topics":
      //github.updateRepoTopics(token, repo_name, value);
      break;
    default:
    // do nothing
  }
  console.log(key + " on " + repo_name + " updated to: " + value);
}

export function updateRepoDescription(token, repo_name, description) {
  const octokat = auth(token);
  return octokat
    .repos("karnov", repo_name)
    .update({ name: repo_name, description: description })
    .then(() => {
      // Done!
    });
}

export function updateRepoTopics(token, repo_name, topics) {
  const octokat = auth(token);
  return octokat
    .repos("karnov", repo_name, "topics")
    .add({ names: topics })
    .then(() => {
      // Done!
    });
}
