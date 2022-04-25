```
const obj = {};
obj.property1 = 42;

console.log(obj.hasOwnProperty('property1'));
// expected output: true

console.log(obj.hasOwnProperty('toString'));
// expected output: false

console.log(obj.hasOwnProperty('hasOwnProperty'));
// expected output: false
```