import { existsSync } from 'fs-extra';
import { replace, startCase } from 'lodash';
import { join, sep } from 'path';
import { cwd } from 'process';

import { Answers } from './prompting';

export class GeneratorOptions {
  public get name(): string {
    return this.answers.name;
  }

  public get namePascal(): string {
    return replace(startCase(this.name), / /g, '');
  }

  public get folderName(): string {
    return this.name
      .split('/')
      .map(s => s.replace(/@/g, ''))
      .join('_');
  }

  public get createPackageFolder(): boolean {
    return (
      cwd()
        .split(sep)
        .pop() !== this.folderName
    );
  }

  public get scopedPackage(): boolean {
    return this.name.includes('@');
  }

  public get description(): string {
    return this.answers.description || 'NO DESCRIPTION PROVIDED';
  }

  public get type(): 'library' | 'application' {
    return this.answers.type;
  }

  public get gitUser(): string {
    return this.answers.gitUser;
  }

  public get gitEmail(): string {
    return this.answers.gitEmail;
  }

  public get gitUrl(): string {
    return 'https://github.com/USER/REPO';
  }

  public get initializeGitRepo(): boolean {
    return this.createPackageFolder || !existsSync(join(cwd(), this.folderName, '.git'));
  }

  constructor(private readonly answers: Answers) {}
}
