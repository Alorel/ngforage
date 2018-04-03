const gulp = require('gulp');

gulp.task('changelog', cb => {
  const YAML = require('yamljs');
  const reduce = require('lodash/reduce');
  const sortBy = require('lodash/sortBy');
  let parsed = YAML.parseFile('./CHANGELOG.yml');

  Object.keys(parsed)
    .sort()
    .reverse()
    .reduce(
      (acc, version) => {
        acc[version] = parsed[version];

        return acc;
      },
      {}
    );

  const versions = Object.keys(parsed);
  const numVersions = versions.length;

  let i = 1;

  parsed = reduce(
    parsed,
    (acc, changes, version) => {
      changes = sortBy(changes, change => Object.keys(change)[0]);
      changes = changes.map(change => {
        const type = Object.keys(change)[0];
        const message = change[type];

        return {type, message};
      });

      const toPush = {
        version,
        changes
      };

      if (i < numVersions) {
        toPush.diff = {
          from: versions[i],
          to: version
        };
      }

      acc.push(toPush);

      i++;
      return acc;
    },
    []
  );

  parsed = parsed.map(
    spec => {
      const out = [
        '<details>',
        `  <summary>${spec.version}</summary>\n`
      ];

      if (spec.diff) {
        out.push(`  [Diff from ${spec.diff.from}](https://github.com/Alorel/ngforage/compare/${spec.diff.from}...${spec.diff.to})\n`);
      }

      out.push('  <ul>');

      for (const change of spec.changes) {
        out.push(`    <li><strong>${change.type}:</strong> ${change.message}</li>`)
      }

      out.push('  </ul>', '</details>');

      return out.join('\n');
    }
  ).join('\n\n') + '\n';

  require('fs').writeFile('./CHANGELOG.md', parsed, cb);
});
