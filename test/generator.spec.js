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

describe('typescript project generator', () => {

    beforeEach(() => {
    });

    it('should be tested', async () => {
        const folder = await helpers
            .run(TypescriptProjectGenerator)
            .withPrompts(defaultPrompts);
        console.log(folder);
    });

});
