import chalk from 'chalk';
import Generator = require('yeoman-generator');
import yosay = require('yosay');

import { GeneratorOptions } from './options';
import { Answers } from './prompting';
import { join } from 'path';

export class TypescriptProjectGenerator extends Generator {
  protected generatorOptions!: GeneratorOptions;

  public initializing(): void {
    this.log(yosay(`Welcome to the ${chalk.green('typescript project')} generator, I'll compose a new project for you.`));
  }

  public async prompting(): Promise<Answers> {
    const answers = (await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'The projects name?',
        default: process
          .cwd()
          .split(/\\|\//)
          .pop(),
        validate: input => (!!!input ? 'Please enter a value' : true),
      },
      {
        type: 'input',
        name: 'description',
        message: 'The projects description?',
      },
      {
        type: 'list',
        name: 'type',
        message: 'The projects type?',
        choices: ['library', 'application'],
      },
    ])) as Answers;
    answers.gitUser = this.user.git.name();
    answers.gitEmail = this.user.git.email();

    this.generatorOptions = new GeneratorOptions(answers);

    return answers;
  }

  public configuring(): void {
    this.log(`Configuring your module ${chalk.green(this.generatorOptions.name)}.`);
    this.sourceRoot(join(__dirname, 'templates'));

    if (this.generatorOptions.createPackageFolder) {
      this.destinationRoot(join(this.destinationRoot(), this.generatorOptions.folderName));
    }
  }

  public writing(): void {
    this.log(`Writing template files.`);

    const files = [
      'config/tsconfig.base.json',
      'config/tsconfig.build.json',
      '_editorconfig',
      '_gitignore',
      '_gitlab-ci.yml',
      'jest.json',
      'package.json_',
      'README.md',
      'tsconfig.json',
      'tslint.json',
    ];

    if (this.generatorOptions.type === 'library') {
      files.push('_npmignore');
    }

    for (const file of files) {
      const destination = file.replace(/^_/, '.').replace(/_$/g, '');
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(destination), this.generatorOptions);
    }

    if (this.generatorOptions.type === 'library') {
      this.fs.copyTpl(this.templatePath('src/index.ts'), this.destinationPath('src/index.ts'), this.generatorOptions);
      this.fs.copyTpl(
        this.templatePath('test/index.spec.ts'),
        this.destinationPath('test/index.spec.ts'),
        this.generatorOptions
      );
    } else {
      this.fs.copyTpl(this.templatePath('src/index.ts'), this.destinationPath('src/app.ts'), this.generatorOptions);
      this.fs.copyTpl(
        this.templatePath('test/index.spec.ts'),
        this.destinationPath('test/app.spec.ts'),
        this.generatorOptions
      );
    }
  }

  public install(): void {
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

    this.spawnCommandSync('npm', ['i', '-S', 'tslib']);
    this.spawnCommandSync('npm', ['i', '-D', ...devDeps]);

    if (this.generatorOptions.initializeGitRepo) {
      this.log('Initializing the git repo.');
      this.spawnCommandSync('git', ['init']);

      this.log('Commiting the base files.');
      this.spawnCommandSync('git', ['add', '.']);
      this.spawnCommandSync('git', ['commit', '-am', '"chore: Initial commit."']);
    }
  }

  public end(): void {
    this.log(`${chalk.green('All done!')}`);
    this.log(`To start coding, run ${chalk.cyan('npm run develop')}`);
    this.log(`To run the tests, run ${chalk.cyan('npm test')}`);
    this.log(`To run the tests in a development (watching) mode, run ${chalk.cyan('npm test:watch')}`);
  }
}
