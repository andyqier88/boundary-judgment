import { pathExists } from 'path-exists';

console.log(await pathExists('./readme.md')); // true
console.log(await pathExists('./README.md')); // true
console.log(process.env.npm_config_user_agent);