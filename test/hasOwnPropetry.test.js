import { hasOwnProperty } from './../lib/hasOwnProperty/hasOwnProperty.js'
const obj = {};
obj.property1 = 42;

test('hasOwnProperty', () => {
    const isExists = hasOwnProperty(obj,'property1')
    expect(isExists).toBe(true)
});
test('hasOwnProperty protoProperty', () => {
    const isExistsWithCase = hasOwnProperty(obj,'toString')
    expect(isExistsWithCase).toBe(false)
});