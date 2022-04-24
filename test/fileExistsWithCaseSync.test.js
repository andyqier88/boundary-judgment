import fileExistsWithCaseSync from './../lib/fileExistsWithCaseSync/fileExistsWithCaseSync'


test('fileExistsWithCaseSync', () => {
    expect(fileExistsWithCaseSync('./../README.md')).toBe(true);
},1000);
