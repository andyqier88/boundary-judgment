# fileExistsWithCaseSync
## check if file exists (case-sensitive)

when we need check if file exists in Node.js
```
const fs =  require('fs');

console.log(fs.existsSync('README.md')); // true
console.log(fs.existsSync('readme.md')); // true or false, depending on the file system
```
use fileExistsWithCaseSync

```
import fileExistsWithCaseSync from './fileExistsWithCaseSync/fileExistsWithCaseSync'

console.log(fs.existsSync('README.md')); // true
console.log(fs.existsSync('readme.md')); // false
```