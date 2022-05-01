import { fileExistsWithCaseSync } from './../lib/fileExistsWithCaseSync/fileExistsWithCaseSync.js'



test('fileExistsWithCaseSync', () => {
    const isExists = fileExistsWithCaseSync('./README.md')
    expect(isExists).toBe(true)
});
test('fileExistsWithCaseSync case-sensitive', () => {
    const isExistsWithCase = fileExistsWithCaseSync('./readme.md')
    expect(isExistsWithCase).toBe(false)
});