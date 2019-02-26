import { Constructor, run as yeomanRun, RunContext } from 'yeoman-test';

import { TypescriptProjectGenerator } from '../app/generator';
import { GeneratorOptions } from '../app/options';
import { Answers } from '../app/prompting';

export class TestGenerator extends TypescriptProjectGenerator {
  constructor(args: string | string[], opts: {}) {
    super(args, opts);

    this.spawnCommand = jest.fn();
    this.spawnCommandSync = jest.fn();
  }

  public initializing(): void {
    super.initializing();
  }

  public async prompting(): Promise<Answers> {
    const answers = await super.prompting();
    answers.gitEmail = 'gitEmail';
    answers.gitUser = 'gitUser';
    this.generatorOptions = new GeneratorOptions(answers);
    return answers;
  }

  public configuring(): void {
    super.configuring();
  }

  public writing(): void {
    super.writing();
  }

  public install(): void {
    super.install();
  }

  public end(): void {
    super.end();
  }
}

export const run = (yeomanRun as unknown) as (
  generator: Constructor<TestGenerator>
) => RunContext & { generator: TestGenerator };
