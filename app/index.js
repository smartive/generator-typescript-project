const { cyan, green, yellow } = require('chalk');
const { replace, startCase } = require('lodash');
const { join } = require('path');
const Generator = require('yeoman-generator');
const yosay = require('yosay');

class GeneratorOptions {
    constructor(options) {
        this.name = options.name;
        this.namePascal = replace(startCase(this.name), / /g, '');
        this.folderName = this.name.split('/').map(s => s.replace(/@/g, '')).join('_');
        this.createPackageFolder = process.cwd().split(/\\|\//).pop() !== this.folderName;
        this.scopedPackage = this.name.indexOf('@') >= 0;

        this.description = options.description || 'NO DESCRIPTION PROVIDED';

        this.type = options.type;

        this.withTypedoc = options.withTypedoc;

        this.initializeGitRepo = options.initializeGitRepo;
        this.gitUser = options.gitUser;
        this.gitEmail = options.gitEmail;
        this.gitUrl = this.formatUrl(options.gitUrl || 'github.com/USER/REPO');

        this.ciconfigs = options.ciconfigs;
    }

    formatUrl(value) {
        if (value.indexOf('http://') >= 0 || value.indexOf('https://') >= 0) {
            return value;
        }
        return `https://${value}`;
    }

    get provideGitlab() {
        return this.ciconfigs.indexOf('GitLab') >= 0;
    }

    get provideTravis() {
        return this.ciconfigs.indexOf('Travis') >= 0;
    }

    get provideAppveyor() {
        return this.ciconfigs.indexOf('Appveyor') >= 0;
    }
}

class GiuseppePluginGenerator extends Generator {
    initializing() {
        this.log(yosay(
            `Welcome to the ${green('typescript project')} generator, I'll compose a new project for you.`,
        ));
    }

    async prompting() {
        const answers = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'The projects name',
                default: process.cwd().split(/\\|\//).pop(),
            },
            {
                type: 'input',
                name: 'description',
                message: 'The projects description',
            },
            {
                type: 'list',
                name: 'type',
                message: 'The projects type',
                choices: ['library', 'application'],
            },
            {
                type: 'checkbox',
                name: 'ciconfigs',
                message: 'Which CI configs should I provide?',
                choices: ['GitLab', 'Travis', 'Appveyor'],
            },
            {
                type: 'confirm',
                name: 'withTypedoc',
                message: 'Should I typedoc? (Typescript jsdoc -> html generator)',
                default: false,
            },
            {
                type: 'confirm',
                name: 'initializeGitRepo',
                message: 'Should I initialize a git repository?',
                default: true,
            },
            {
                type: 'input',
                name: 'gitUrl',
                message: 'The url of the git repository?',
                when: answers => answers['initializeGitRepo'],
                validate: input => !!!input ? 'Please enter a value' : true,
            },
        ]);

        answers.gitUser = this.user.git.name();
        answers.gitEmail = this.user.git.email();
        this.options = new GeneratorOptions(answers);
        return answers;
    }

    configuring() {
        this.log(`Configuring your module ${green(this.options.name)}.`);

        if (this.options.createPackageFolder) {
            this.destinationRoot(join(this.destinationRoot(), this.options.folderName));
        }
    }

    writing() {
        this.log(`Writing template files.`);

        // Base files.
        this._writeTemplate('_gitignore', '.gitignore');
        this._writeTemplate('_npmignore', '.npmignore');
        this._copyFile('_editorconfig', '.editorconfig');
        this._copyFile('jest.json');
        this._writeTemplate('package.json');
        this._writeTemplate('README.md');
        this._copyFile('tsconfig.json');
        this._copyFile('tslint.json');
        this._writeTemplate('config/tsconfig.base.json');
        this._writeTemplate('config/tsconfig.build.json');

        if (this.options.type === 'library') {
            this._copyFile('_npmrc', '.npmrc');
        }

        if (this.options.provideGitlab) {
            this._writeTemplate('_gitlab-ci.yml', '.gitlab-ci.yml');
        }

        if (this.options.provideAppveyor) {
            this._writeTemplate('_appveyor.yml', '.appveyor.yml');
        }

        if (this.options.provideTravis) {
            this._writeTemplate('_travis.yml', '.travis.yml');
        }

        if (this.options.type === 'library') {
            this._copyFile('src/index.ts');
            this._writeTemplate('test/index.spec.ts');
        } else {
            this._copyFile('src/index.ts', 'src/app.ts');
            this._writeTemplate('test/index.spec.ts', 'test/app.spec.ts');
        }
    }

    install() {
        this.log('Installing dependencies.');

        const devDeps = [
            '@smartive/tslint-config',
            '@types/jest',
            'del-cli',
            'jest',
            'semantic-release',
            'ts-jest',
            'tslint',
            'tsutils',
            'typescript',
        ];

        if (this.options.withTypedoc) {
            devDeps.push('typedoc');
        }

        this.spawnCommandSync('npm', ['i', '-S', 'tslib']);
        this.spawnCommandSync('npm', ['i', '-D', ...devDeps]);

        if (this.options.initializeGitRepo) {
            this.log('Initializing the git repo.')
            this.spawnCommandSync('git', ['init']);
            this.spawnCommandSync('git', ['remote', 'add', 'origin', this.options.gitUrl]);

            this.log('Commiting the base files.');
            this.spawnCommandSync('git', ['add', '.']);
            this.spawnCommandSync('git', ['commit', '-am', '"chore: Initial commit."']);
        }
    }

    end() {
        this.log(`${green('All done!')}`);
        this.log(`To start coding, run ${cyan('npm run develop')}`);
        this.log(`To run the tests, run ${cyan('npm test')}`);
        this.log(`To run the tests in a development (watching) mode, run ${cyan('npm test:watch')}`);
        if (this.options.withTypedoc) {
            this.log(`And to generate the documentation for your project, run ${cyan('npm run typedoc')}`);
        }
        if (this.options.provideAppveyor || this.options.provideGitlab || this.options.provideTravis) {
            this.log(`Please notice that you need to provide an ${yellow('GH_TOKEN')} and a ${yellow('NPM_TOKEN')}!`);
        }
    }

    /**
     * Writes a template file to a destination with the "options" object as data. If "to" is omitted, from is used.
     *
     * @param {string} from
     * @param {string} [to]
     *
     * @memberof GiuseppePluginGenerator
     */
    _writeTemplate(from, to) {
        if (!to) {
            to = from;
        }

        this.fs.copyTpl(
            this.templatePath(from),
            this.destinationPath(to),
            this.options
        );
    }

    /**
     * Copies a file from a to b. If "to" is omitted, from is used.
     *
     * @param {string} from
     * @param {string} [to]
     *
     * @memberof GiuseppePluginGenerator
     */
    _copyFile(from, to) {
        if (!to) {
            to = from;
        }

        this.fs.copy(
            this.templatePath(from),
            this.destinationPath(to)
        );
    }
}

module.exports = GiuseppePluginGenerator;
