const TEAM_NAMES = [
  "bridge",
  "content-care",
  "core-services",
  "pipelines",
  "pro",
  "ta",
  "digital-transformation",
  "data-science"
];

export function valid_name(name) {
  return /^[a-z0-9.-]+$/.test(name) && !/^kg/.test(name);
}

export function valid_description(description) {
  return description;
}

export function valid_topics(topics) {
  return topics.some(topic => TEAM_NAMES.includes(topic));
}
