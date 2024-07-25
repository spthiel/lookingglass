import secrets from "../../.secrets.json";

const token = localStorage[secrets.teamsStorageKey];

console.log(token);
