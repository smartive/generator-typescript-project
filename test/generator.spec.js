const { join } = require('path');
const helpers = require('yeoman-test');
const TypescriptProjectGenerator = require('../app');

const defaultPrompts = {
    name: 'name',
    description: 'description',
    type: 'library',
    ciconfigs: [],
    withTypedoc: false,
    initializeGitRepo: false,
}

// const setup = helpers.setUpTestDirectory(join(__dirname, './temp'));

describe('typescript project generator', () => {

    beforeEach(() => {
    });

    it('should be tested', async () => {
        expect(true).toBe(true);
        // const a = await helpers.run(TypescriptProjectGenerator);
        // console.log(a);
    });

});
