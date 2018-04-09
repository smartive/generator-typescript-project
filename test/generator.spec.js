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

        it('should change main in package json file for application type', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    type: 'application',
                });
            const content = readFileSync(join(folder, 'name', 'package.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add typedoc to package json', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    type: 'application',
                    withTypedoc: true
                });
            const content = readFileSync(join(folder, 'name', 'package.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add giturl to package json', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    initializeGitRepo: true,
                    gitUrl: 'https://github.com/smartive/generator-typescript-project',
                });
            const content = readFileSync(join(folder, 'name', 'package.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add access config to package json if package is scoped', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    name: '@smartive/scoped-name'
                });
            const content = readFileSync(join(folder, 'smartive_scoped-name', 'package.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add default tsconfig', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', 'tsconfig.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add default ts base config', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', 'config', 'tsconfig.base.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add default ts build config', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', 'config', 'tsconfig.build.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should change out dir in ts build config for application', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    type: 'application',
                });
            const content = readFileSync(join(folder, 'name', 'config', 'tsconfig.build.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should remove comments and declarations in build config for application', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    type: 'application',
                });
            const content = readFileSync(join(folder, 'name', 'config', 'tsconfig.base.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add dom lib in build config with typedoc', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    withTypedoc: true,
                });
            const content = readFileSync(join(folder, 'name', 'config', 'tsconfig.base.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add default tslint config', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            const content = readFileSync(join(folder, 'name', 'tslint.json'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add npmrc for library', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            expect(existsSync(join(folder, 'name', '.npmrc'))).toBe(true);
        });

        it('should not add npmrc for application', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    type: 'application',
                });
                expect(existsSync(join(folder, 'name', '.npmrc'))).toBe(false);
        });

        it('should add gitlab ci if selected', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    ciconfigs: ['GitLab'],
                });
            const content = readFileSync(join(folder, 'name', '.gitlab-ci.yml'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add appveyor ci if selected', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    ciconfigs: ['Appveyor'],
                });
            const content = readFileSync(join(folder, 'name', '.appveyor.yml'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should add travis ci if selected', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    ciconfigs: ['Travis'],
                });
            const content = readFileSync(join(folder, 'name', '.travis.yml'), 'utf8');
            expect(content).toMatchSnapshot();
        });

        it('should name file index.ts if its a library', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts(defaultPrompts);
            expect(existsSync(join(folder, 'name', 'src', 'index.ts'))).toBe(true);
            expect(existsSync(join(folder, 'name', 'src', 'app.ts'))).toBe(false);
            expect(existsSync(join(folder, 'name', 'test', 'index.spec.ts'))).toBe(true);
            expect(existsSync(join(folder, 'name', 'test', 'app.spec.ts'))).toBe(false);
        });

        it('should name file app.ts if its an application', async () => {
            const folder = await helpers
                .run(TypescriptProjectGenerator)
                .withPrompts({
                    ...defaultPrompts,
                    type: 'application',
                });
            expect(existsSync(join(folder, 'name', 'src', 'app.ts'))).toBe(true);
            expect(existsSync(join(folder, 'name', 'src', 'index.ts'))).toBe(false);
            expect(existsSync(join(folder, 'name', 'test', 'app.spec.ts'))).toBe(true);
            expect(existsSync(join(folder, 'name', 'test', 'index.spec.ts'))).toBe(false);
        });

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
