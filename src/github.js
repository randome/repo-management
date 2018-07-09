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

export function updateRepoDescription(token, name, description) {
  const octokat = auth(token);
  return octokat
    .repos("karnov", name)
    .update({ name: name, description: description })
    .then(() => {
      // Done!
    });
}

export function updateRepoTopics(token, name, tags) {
  const octokat = auth(token);
  return octokat
    .repos("karnov", name, "topics")
    .add({ names: tags })
    .then(() => {
      // Done!
    });
}
