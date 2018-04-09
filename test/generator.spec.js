const { existsSync, readFileSync } = require('fs');
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

    describe('template files', () => {

        it('should generate a project folder', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            expect(existsSync(join(folder, 'name'))).toBe(true);
        });

        it('should use same folder when no name is present', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    name: null,
                });
            expect(existsSync(join(folder, 'package.json'))).toBe(true);
        });

        it('should add a default git ignore', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', '.gitignore'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add doc to git ignore', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    withTypedoc: true,
                });
            const content = readFileSync(join(folder, 'name', '.gitignore'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add a npm ignore', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', '.npmignore'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add doc to npm ignore', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    withTypedoc: true,
                });
            const content = readFileSync(join(folder, 'name', '.npmignore'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add CI configs to npm ignore', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    ciconfigs: ['GitLab', 'Appveyor', 'Travis'],
                });
            const content = readFileSync(join(folder, 'name', '.npmignore'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add an editorconfig', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', '.editorconfig'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add a jest config', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', 'jest.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add a readme', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', 'README.md'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should a default package json', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', 'package.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should change main in package json file for application type');

        it('should add typedoc to package json');

        it('should add giturl to package json');

        it('should add access config to package json if package is scoped');

        it('should add default tsconfig');

        it('should add default ts base config');

        it('should add default ts build config');

        it('should change out dire in ts build config for application');

        it('should remove comments in build config for application');

        it('should remove declarations in build config for application');

        it('should add dom lib in build config with typedoc');

        it('should add default tslint config');

        it('should add npmrc for library');

        it('should add gitlab ci if selected');

        it('should add appveyor ci if selected');

        it('should add travis ci if selected');

        it('should name file index.ts if its a library');

        it('should name file app.ts if its an application');

    });

    describe('install', () => {

        it('should install tslib', async () => {
            await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            expect(TypescriptProjectGenerator.staticSpawnMock.mock.calls[0]).toMatchSnapshot();
        });

        it('should install dev dependencies', async () => {
            await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            expect(TypescriptProjectGenerator.staticSpawnMock.mock.calls[1]).toMatchSnapshot();
        });

        it('should add typedoc dev dependency', async () => {
            await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    withTypedoc: true,
                });
            expect(TypescriptProjectGenerator.staticSpawnMock.mock.calls[1]).toMatchSnapshot();
        });

    });

    describe('git', () => {

        it('should initialize a git repo', async () => {
            await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    initializeGitRepo: true,
                    gitUrl: 'https://github.com/smartive/generator-typescript-project',
                });
            expect(TypescriptProjectGenerator.staticSpawnMock.mock.calls[2]).toMatchSnapshot();
        });

        it('should add git remote origin', async () => {
            await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    initializeGitRepo: true,
                    gitUrl: 'https://github.com/smartive/generator-typescript-project',
                });
            expect(TypescriptProjectGenerator.staticSpawnMock.mock.calls[3]).toMatchSnapshot();
        });

        it('should add base files', async () => {
            await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    initializeGitRepo: true,
                    gitUrl: 'https://github.com/smartive/generator-typescript-project',
                });
            expect(TypescriptProjectGenerator.staticSpawnMock.mock.calls[4]).toMatchSnapshot();
        });

        it('should commit the base files', async () => {
            await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    initializeGitRepo: true,
                    gitUrl: 'https://github.com/smartive/generator-typescript-project',
                });
            expect(TypescriptProjectGenerator.staticSpawnMock.mock.calls[5]).toMatchSnapshot();
        });

    });

});
