const TapRender = require('@munter/tap-render');
const hyperlink = require('hyperlink');
const spot = require('tap-spot');
const configSchema = require('./config.schema.json');
const globby = require('globby');

const canonicalRoot = process.env.URL;

module.exports = {
  name: 'checklinks',

  config: configSchema,

  postBuild: async ({
    constants: { BUILD_DIR },
    pluginConfig: {
      entryPoints,
      skipPatterns,
      todoPatterns,
      checkExternal,
      pretty,
      ...defaultConfig
    }
  }) => {
    /** @type {string} */
    const root = BUILD_DIR;

    /** @type {FilterFunction} */
    const skipFilter = report =>
      Object.values(report).some(value =>
        skipPatterns.some(pattern => String(value).includes(pattern))
      );

    /** @type {FilterFunction} */
    const todoFilter = report =>
      Object.values(report).some(value =>
        todoPatterns.some(pattern => String(value).includes(pattern))
      );

    const t = new TapRender();

    if (pretty) {
      t.pipe(spot()).pipe(process.stdout);
    } else {
      t.pipe(process.stdout);
    }

    await hyperlink(
      {
        inputUrls: globby.sync(entryPoints, { cwd: root }),
        ...defaultConfig,
        canonicalRoot,
        root,
        skipFilter,
        todoFilter,
        internalOnly: !checkExternal
      },
      t
    );

    const results = t.close();

    if (results.fail) {
      process.exit(1);
    }

    return results;
  }
};
