import prompts from 'prompts';
import semver from 'semver';
import colors from 'picocolors';
import pkg from './../package.json';
import path from 'path';

import {
  args,
  getVersionChoices,
  isDryRun,
  logRecentCommits,
  run,
  runIfNotDry,
  step,
  updateVersion,
} from './releaseUtils';

async function main(): Promise<void> {
  let targetVersion: string | undefined;
  const pkgPath = path.resolve('package.json');
  const { name, version } = pkg;
  // const { pkg }: { pkg: string } = await prompts({
  //   type: 'select',
  //   name: 'pkg',
  //   message: 'Select package',
  //   choices: packages.map((i) => ({ value: i, title: i })),
  // });
console.log('pkg->',path.resolve('package.json'));
console.log('pkg dir->',path.resolve(__dirname, 'package.json'));

  if (!name) return;

  await logRecentCommits(name);

  // const { currentVersion, pkgName, pkgPath, pkgDir } = getPackageInfo(pkg);

  if (!targetVersion) {
    const { release }: { release: string } = await prompts({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: getVersionChoices(version),
    });

    if (release === 'custom') {
      const res: { version: string } = await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: version,
      });
      targetVersion = res.version;
    } else {
      targetVersion = release;
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`);
  }

  const tag = `${name}@${targetVersion}`;

  if (targetVersion.includes('beta') && !args.tag) {
    args.tag = 'beta';
  }

  const { yes }: { yes: boolean } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing ${colors.yellow(tag)} Confirm?`,
  });

  if (!yes) {
    return;
  }

  step('\nUpdating package version...');
  updateVersion(pkgPath, targetVersion);

  step('\nGenerating changelog...');
  const changelogArgs = [
    'conventional-changelog',
    '-p',
    'angular',
    '-i',
    'CHANGELOG.md',
    '-s',
    '--commit-path',
    '.',
  ];
  changelogArgs.push('--lerna-package', name);
  await run('npx', changelogArgs, { cwd: path.resolve() });

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' });
  if (stdout) {
    step('\nCommitting changes...');
    await runIfNotDry('git', ['add', '-A']);
    await runIfNotDry('git', ['commit', '-m', `release: ${tag}`]);
    await runIfNotDry('git', ['tag', tag]);
  } else {
    console.log('No changes to commit.');
    return;
  }

  step('\nPushing to GitLab...');
  await runIfNotDry('git', ['push', 'origin', `refs/tags/${tag}`]);
  await runIfNotDry('git', ['push']);

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`);
  } else {
    console.log(colors.green('push finished 推送完成'));
  }

  console.log();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
