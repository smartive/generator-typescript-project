import { pathExists, readdir, stat, readFile } from 'fs-extra';
import { join } from 'path';

import { run, TestGenerator } from './generator-wrapper';

const defaultPrompts = {
  name: 'name',
  description: 'description',
  type: 'library',
};

describe('Typescript Project Generator', () => {
  describe('Template Files', () => {
    it('should generate a project folder when needed', async () => {
      const ctx = run(TestGenerator).withPrompts(defaultPrompts);
      const folder = await ctx;

      expect(await pathExists(join(folder, 'name'))).toBeTruthy();
    });

    it('should use same folder when no name is present', async () => {
      const ctx = run(TestGenerator).withPrompts({ ...defaultPrompts, name: null });
      const folder = await ctx;

      expect(await pathExists(join(folder, 'package.json'))).toBeTruthy();
    });

    it('should generate the correct library files', async () => {
      const ctx = run(TestGenerator).withPrompts(defaultPrompts);
      const folder = await ctx;

      const snapshotDirectory = async (dirPath: string, prefix?: string) => {
        for (const file of await readdir(dirPath)) {
          const filePath = join(dirPath, file);
          const stats = await stat(filePath);
          if (stats.isDirectory()) {
            await snapshotDirectory(filePath, `${prefix || ''}${file}/`);
            continue;
          }

          expect({
            name: `${prefix || ''}${file}`,
            content: await readFile(filePath, 'utf8'),
          }).toMatchSnapshot();
        }
      };

      await snapshotDirectory(join(folder, 'name'));
    });

    it('should generate the correct application files', async () => {
      const ctx = run(TestGenerator).withPrompts({ ...defaultPrompts, type: 'application' });
      const folder = await ctx;

      const snapshotDirectory = async (dirPath: string, prefix?: string) => {
        for (const file of await readdir(dirPath)) {
          const filePath = join(dirPath, file);
          const stats = await stat(filePath);
          if (stats.isDirectory()) {
            await snapshotDirectory(filePath, `${prefix || ''}${file}/`);
            continue;
          }

          expect({
            name: `${prefix || ''}${file}`,
            content: await readFile(filePath, 'utf8'),
          }).toMatchSnapshot();
        }
      };

      await snapshotDirectory(join(folder, 'name'));
    });

    it('should add access config to package json if package is scoped', async () => {
      const ctx = run(TestGenerator).withPrompts({ ...defaultPrompts, name: '@test/mc-testington' });
      const folder = await ctx;

      expect(await readFile(join(folder, 'test_mc-testington', 'package.json'), 'utf8')).toMatchSnapshot();
    });
  });

  describe('Package Installation', () => {
    it('should install the correct list of dependencies', async () => {
      const ctx = run(TestGenerator).withPrompts(defaultPrompts);
      await ctx;

      expect((ctx.generator.spawnCommandSync as jest.Mock).mock.calls[0][1].slice(2)).toMatchSnapshot();
    });

    it('should install the correct list of dev dependencies', async () => {
      const ctx = run(TestGenerator).withPrompts(defaultPrompts);
      await ctx;

      expect((ctx.generator.spawnCommandSync as jest.Mock).mock.calls[1][1].slice(2)).toMatchSnapshot();
    });
  });
});
