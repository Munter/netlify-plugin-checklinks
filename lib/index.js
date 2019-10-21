const extractConfig = require('./extractConfig');
const TapRender = require('@munter/tap-render');
const hyperlink = require('hyperlink');
const spot = require('tap-spot');

module.exports = {
  postBuild: async config => {
    const {
      root,
      canonicalRoot,
      entryPoints,
      recursive,
      pretty,
      skipFilter,
      todoFilter,
      checkExternal,
      followSourceMaps
    } = extractConfig(config);

    const t = new TapRender();

    if (pretty) {
      t.pipe(spot()).pipe(process.stdout);
    } else {
      t.pipe(process.stdout);
    }

    await hyperlink(
      {
        root,
        canonicalRoot,
        inputUrls: entryPoints,
        recursive,
        skipFilter,
        todoFilter,
        internalOnly: !checkExternal,
        followSourceMaps
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
